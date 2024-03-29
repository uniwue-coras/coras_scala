package model.graphql

import com.github.t3hnar.bcrypt._
import model._
import model.matching.wordMatching.WordExtractor
import sangria.schema._

import scala.collection.mutable.{Map => MutableMap}
import scala.concurrent.{ExecutionContext, Future}

trait RootMutation extends GraphQLBasics with JwtHelpers:
  self: GraphQLModel =>

  protected implicit val ec: ExecutionContext

  protected val jwtsToClaim: MutableMap[String, String] = MutableMap.empty

  private val onLoginError    = UserFacingGraphQLError("Invalid combination of username and password!")
  private val onPwChangeError = UserFacingGraphQLError("Can't change password!")

  private val resolveLogin: Resolver[Unit, String] = unpackedResolverWithArgs { case (GraphQLContext(_, tableDefs, _, _), _, args) =>
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

  private val resolveRegistration: Resolver[Unit, String] = unpackedResolverWithArgs { case (GraphQLContext(_, tableDefs, _, _), _, args) =>
    val username       = args.arg(usernameArg)
    val password       = args.arg(passwordArg)
    val passwordRepeat = args.arg(passwordRepeatArg)

    for {
      passwordHash <- Future.fromTry { password.bcryptSafeBounded }
      _            <- futureFromBool(password == passwordRepeat, UserFacingGraphQLError("Passwords don't match"))
      _            <- tableDefs.futureInsertUser(User(username, Some(passwordHash), Rights.Student))
    } yield username
  }

  private val resolveChangePassword: Resolver[Unit, Boolean] = resolveWithUser { case (context, User(username, maybeOldPasswordHash, _)) =>
    val oldPassword       = context.arg(oldPasswordArg)
    val newPassword       = context.arg(passwordArg)
    val newPasswordRepeat = context.arg(passwordRepeatArg)

    for {
      _ /* passwordsMatch */ <- futureFromBool(newPassword == newPasswordRepeat, UserFacingGraphQLError("Passwords don't match"))
      oldPasswordHash        <- futureFromOption(maybeOldPasswordHash, onPwChangeError)
      oldPwOkay              <- Future.fromTry { oldPassword isBcryptedSafeBounded oldPasswordHash }
      _ /* pwChecked */      <- futureFromBool(oldPwOkay, onPwChangeError)
      passwordUpdated        <- context.ctx.tableDefs.futureUpdatePasswordForUser(username, Some(newPassword.boundedBcrypt))
    } yield passwordUpdated
  }

  private val resolveChangeRights: Resolver[Unit, Rights] = resolveWithAdmin { case (context, _) =>
    val newRights = context.arg(newRightsArg)

    for {
      _ <- context.ctx.tableDefs.futureUpdateUserRights(context.arg(usernameArg), newRights)
    } yield newRights
  }

  // abbreviations

  private val resolveSubmitNewAbbreviation: Resolver[Unit, Abbreviation] = resolveWithAdmin { case (context, _) =>
    val Abbreviation(abbreviation, word) = context.arg(abbreviationInputArgument)

    val normalizedAbbreviation = abbreviation.toLowerCase
    val normalizedWord         = WordExtractor.normalizeWord(word).toLowerCase

    for {
      _ <- context.ctx.tableDefs.futureInsertAbbreviation(normalizedAbbreviation, normalizedWord)
    } yield Abbreviation(normalizedAbbreviation, normalizedWord)
  }

  private val resolveAbbreviation: Resolver[Unit, Option[Abbreviation]] = resolveWithAdmin { case (context, _) =>
    context.ctx.tableDefs.futureAbbreviation(context.arg(abbreviationArgument))
  }

  // related words

  private val resolveCreateEmptyRelatedWordsGroup: Resolver[Unit, Int] = resolveWithAdmin { case (context, _) =>
    context.ctx.tableDefs.futureNewEmptyRelatedWordsGroup
  }

  private val resolveRelatedWordsGroup: Resolver[Unit, Option[RelatedWordsGroup]] = resolveWithAdmin { case (context, _) =>
    context.ctx.tableDefs.futureRelatedWordGroupByGroupId(context.arg(groupIdArgument))
  }

  // paragraph synonym

  private val resolveCreateParagraphSynonym: Resolver[Unit, ParagraphSynonym] = resolveWithAdmin { case (context, _) =>
    val paragraphSynonymInput = context.arg(paragraphSynonymInputArgument)

    for {
      _ <- context.ctx.tableDefs.futureInsertParagraphSynonym(paragraphSynonymInput)
    } yield paragraphSynonymInput
  }

  private val resolveUpdateParagraphSynoynm: Resolver[Unit, ParagraphSynonym] = resolveWithAdmin { case (context, _) =>
    val paragraphSynonymIdentifier = context.arg(paragraphSynonymIdentifierInputArgument)
    val maybeSentenceNumber        = context.arg(maybeSentenceNumberArgument)
    val synonym                    = context.arg(synonymArgument)

    for {
      _ <- context.ctx.tableDefs.futureUpdateParagraphSynonym(paragraphSynonymIdentifier, maybeSentenceNumber, synonym)
    } yield ParagraphSynonym.build(paragraphSynonymIdentifier, maybeSentenceNumber, synonym)
  }

  private val resolveDeleteParagraphSynonym: Resolver[Unit, ParagraphSynonymIdentifier] = resolveWithAdmin { case (context, _) =>
    val paragraphSynonymIdentifer = context.arg(paragraphSynonymIdentifierInputArgument)

    for {
      _ <- context.ctx.tableDefs.futureDeleteParagraphSynonym(paragraphSynonymIdentifer)
    } yield paragraphSynonymIdentifer
  }

  // exercises

  private val resolveCreateExercise: Resolver[Unit, Int] = resolveWithAdmin { (context, _) =>
    val ExerciseInput(title, text, sampleSolution) = context.arg(exerciseInputArg)

    context.ctx.tableDefs.futureInsertExercise(title, text, sampleSolution)
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
      Field("exerciseMutations", OptionType(Exercise.mutationType), arguments = exerciseIdArg :: Nil, resolve = resolveExercise)
    )
  )
