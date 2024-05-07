package model.graphql

import com.github.t3hnar.bcrypt._
import model._
import model.matching.wordMatching.WordExtractor
import sangria.schema._

import scala.collection.mutable.{Map => MutableMap}
import scala.concurrent.Future

object RootMutation extends GraphQLBasics with JwtHelpers {

  val jwtsToClaim: MutableMap[String, String] = MutableMap.empty

  private val onLoginError    = UserFacingGraphQLError("Invalid combination of username and password!")
  private val onPwChangeError = UserFacingGraphQLError("Can't change password!")

  private val resolveLogin: Resolver[Unit, String] = unpackedResolverWithArgs { case (GraphQLContext(_, tableDefs, _, _ec), _, args) =>
    implicit val ec = _ec

    val username = args.arg(usernameArg)
    val password = args.arg(passwordArg)

    for {
      maybeUser         <- tableDefs.futureMaybeUserByUsername(username)
      user              <- futureFromOption(maybeUser, onLoginError)
      passwordHash      <- futureFromOption(user.maybePasswordHash, onLoginError)
      pwOkay            <- Future.fromTry { password isBcryptedSafeBounded passwordHash }
      _ /* pwChecked */ <- futureFromBool(pwOkay, onLoginError)
    } yield createJwtSession(user.username, user.rights)
  }

  private val resolveRegistration: Resolver[Unit, String] = unpackedResolverWithArgs { case (GraphQLContext(_, tableDefs, _, _ec), _, args) =>
    implicit val ec = _ec

    val username       = args.arg(usernameArg)
    val password       = args.arg(passwordArg)
    val passwordRepeat = args.arg(passwordRepeatArg)

    for {
      passwordHash <- Future.fromTry { password.bcryptSafeBounded }
      _            <- futureFromBool(password == passwordRepeat, UserFacingGraphQLError("Passwords don't match"))
      _            <- tableDefs.futureInsertUser(User(username, Some(passwordHash), Rights.Student))
    } yield username
  }

  private val resolveChangePassword: Resolver[Unit, Boolean] = unpackedResolverWithUser {
    case (GraphQLContext(_, tableDefs, _, _ec), _, User(username, maybeOldPasswordHash, _), args) =>
      implicit val ec = _ec

      val oldPassword       = args.arg(oldPasswordArg)
      val newPassword       = args.arg(passwordArg)
      val newPasswordRepeat = args.arg(passwordRepeatArg)

      for {
        _ /* passwordsMatch */ <- futureFromBool(newPassword == newPasswordRepeat, UserFacingGraphQLError("Passwords don't match"))
        oldPasswordHash        <- futureFromOption(maybeOldPasswordHash, onPwChangeError)
        oldPwOkay              <- Future.fromTry { oldPassword isBcryptedSafeBounded oldPasswordHash }
        _ /* pwChecked */      <- futureFromBool(oldPwOkay, onPwChangeError)
        passwordUpdated        <- tableDefs.futureUpdatePasswordForUser(username, Some(newPassword.boundedBcrypt))
      } yield passwordUpdated
  }

  private val resolveChangeRights: Resolver[Unit, Rights] = unpackedResolverWithAdmin { case (GraphQLContext(_, tableDefs, _, _ec), _, _, args) =>
    implicit val ec = _ec
    val username    = args.arg(usernameArg)
    val newRights   = args.arg(newRightsArg)

    for {
      _ <- tableDefs.futureUpdateUserRights(username, newRights)
    } yield newRights
  }

  // abbreviations

  private val resolveSubmitNewAbbreviation: Resolver[Unit, Abbreviation] = unpackedResolverWithAdmin {
    case (GraphQLContext(_, tableDefs, _, _ec), _, _, args) =>
      implicit val ec = _ec

      val Abbreviation(abbreviation, word) = args.arg(abbreviationInputArgument)

      val normalizedAbbreviation = abbreviation.toLowerCase
      val normalizedWord         = WordExtractor.normalizeWord(word).toLowerCase

      for {
        _ <- tableDefs.futureInsertAbbreviation(normalizedAbbreviation, normalizedWord)
      } yield Abbreviation(normalizedAbbreviation, normalizedWord)
  }

  private val resolveAbbreviation: Resolver[Unit, Option[Abbreviation]] = unpackedResolverWithAdmin { case (GraphQLContext(_, tableDefs, _, _), _, _, args) =>
    tableDefs.futureAbbreviation(args.arg(abbreviationArgument))
  }

  // related words

  private val resolveCreateEmptyRelatedWordsGroup: Resolver[Unit, Int] = unpackedResolverWithAdmin { case (GraphQLContext(_, tableDefs, _, _), _, _, _) =>
    tableDefs.futureNewEmptyRelatedWordsGroup
  }

  private val resolveRelatedWordsGroup: Resolver[Unit, Option[RelatedWordsGroup]] = unpackedResolverWithAdmin {
    case (GraphQLContext(_, tableDefs, _, _), _, _, args) => tableDefs.futureRelatedWordGroupByGroupId(args.arg(groupIdArgument))
  }

  // paragraph synonym

  private val resolveCreateParagraphSynonym: Resolver[Unit, ParagraphSynonym] = unpackedResolverWithAdmin {
    case (GraphQLContext(_, tableDefs, _, _ec), _, _, args) =>
      implicit val ec = _ec

      val paragraphSynonymInput = args.arg(paragraphSynonymInputArgument)

      for {
        _ <- tableDefs.futureInsertParagraphSynonym(paragraphSynonymInput)
      } yield paragraphSynonymInput
  }

  private val resolveUpdateParagraphSynoynm: Resolver[Unit, ParagraphSynonym] = unpackedResolverWithAdmin {
    case (GraphQLContext(_, tableDefs, _, _ec), _, _, args) =>
      implicit val ec = _ec

      val paragraphSynonymIdentifier = args.arg(paragraphSynonymIdentifierInputArgument)
      val maybeSentenceNumber        = args.arg(maybeSentenceNumberArgument)
      val synonym                    = args.arg(synonymArgument)

      for {
        _ <- tableDefs.futureUpdateParagraphSynonym(paragraphSynonymIdentifier, maybeSentenceNumber, synonym)
      } yield ParagraphSynonym.build(paragraphSynonymIdentifier, maybeSentenceNumber, synonym)
  }

  private val resolveDeleteParagraphSynonym: Resolver[Unit, ParagraphSynonymIdentifier] = unpackedResolverWithAdmin {
    case (GraphQLContext(_, tableDefs, _, _ec), _, _, args) =>
      implicit val ec = _ec

      val paragraphSynonymIdentifer = args.arg(paragraphSynonymIdentifierInputArgument)

      for {
        _ <- tableDefs.futureDeleteParagraphSynonym(paragraphSynonymIdentifer)
      } yield paragraphSynonymIdentifer
  }

  // exercises

  private val resolveCreateExercise: Resolver[Unit, Int] = unpackedResolverWithAdmin { case (GraphQLContext(_, tableDefs, _, _), _, _, args) =>
    val ExerciseInput(title, text, sampleSolution) = args.arg(exerciseInputArg)

    tableDefs.futureInsertExercise(title, text, sampleSolution)
  }

  private def resolveClaimJwt: Resolver[Unit, Option[String]] = context => jwtsToClaim.remove(context.arg(ltiUuidArgument))

  val mutationType: ObjectType[GraphQLContext, Unit] = ObjectType(
    "Mutation",
    fields[GraphQLContext, Unit](
      // User management
      Field("register", StringType, arguments = usernameArg :: passwordArg :: passwordRepeatArg :: Nil, resolve = resolveRegistration),
      Field("login", StringType, arguments = usernameArg :: passwordArg :: Nil, resolve = resolveLogin),
      Field("claimJwt", OptionType(StringType), arguments = ltiUuidArgument :: Nil, resolve = resolveClaimJwt),
      Field("changePassword", BooleanType, arguments = oldPasswordArg :: passwordArg :: passwordRepeatArg :: Nil, resolve = resolveChangePassword),
      Field("changeRights", Rights.graphQLType, arguments = usernameArg :: newRightsArg :: Nil, resolve = resolveChangeRights),
      // abbreviations
      Field("submitNewAbbreviation", AbbreviationGraphQLTypes.queryType, arguments = abbreviationInputArgument :: Nil, resolve = resolveSubmitNewAbbreviation),
      Field("abbreviation", OptionType(AbbreviationGraphQLTypes.mutationType), arguments = abbreviationArgument :: Nil, resolve = resolveAbbreviation),
      // related words
      Field("createEmptyRelatedWordsGroup", IntType, resolve = resolveCreateEmptyRelatedWordsGroup),
      Field(
        "relatedWordsGroup",
        OptionType(RelatedWordsGroupGraphQLTypes.mutationType),
        arguments = groupIdArgument :: Nil,
        resolve = resolveRelatedWordsGroup
      ),
      // paragraph synonyms
      Field("createParagraphSynonym", ParagraphSynonym.queryType, arguments = paragraphSynonymInputArgument :: Nil, resolve = resolveCreateParagraphSynonym),
      Field(
        "updateParagraphSynonym",
        ParagraphSynonym.queryType,
        arguments = paragraphSynonymIdentifierInputArgument :: maybeSentenceNumberArgument :: synonymArgument :: Nil,
        resolve = resolveUpdateParagraphSynoynm
      ),
      Field(
        "deleteParagraphSynonym",
        ParagraphSynonymIdentifier.queryType,
        arguments = paragraphSynonymIdentifierInputArgument :: Nil,
        resolve = resolveDeleteParagraphSynonym
      ),
      // correction
      Field("createExercise", IntType, arguments = exerciseInputArg :: Nil, resolve = resolveCreateExercise),
      Field("exerciseMutations", OptionType(Exercise.mutationType), arguments = exerciseIdArg :: Nil, resolve = RootQuery.resolveExercise)
    )
  )
}
