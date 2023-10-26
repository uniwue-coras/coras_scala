package de.uniwue.ls6.matching

import de.uniwue.ls6.model.{Applicability, MatchStatus}
import de.uniwue.ls6.model.SolutionNode
import de.uniwue.ls6.model.Applicability._
import de.uniwue.ls6.matching.{FuzzyWordMatchExplanation, Match, MatchingResult, WordMatcher, WordWithRelatedWords}
import org.scalactic.Prettifier
import org.scalatest.flatspec.AsyncFlatSpec
import org.scalatest.matchers.should.Matchers
import play.api.libs.json.{Json, Writes}
import de.uniwue.ls6.model.SolutionNodeMatch
import better.files._
import scala.annotation.unused
import scala.concurrent.Future
import de.uniwue.ls6.model.RelatedWord

import scala.language.implicitConversions

final case class TestRelatedWord(
  word: String,
  isPositive: Boolean
) extends RelatedWord

final case class FlatSampleSolutionNode(
  id: Int,
  childIndex: Int,
  isSubText: Boolean,
  text: String,
  applicability: Applicability,
  parentId: Option[Int]
) extends SolutionNode

final case class TestSolutionNodeMatch(
  sampleNodeId: Int,
  userNodeId: Int,
  matchStatus: MatchStatus,
  maybeCertainty: Option[WordMatcher.WordMatchingResult]
) extends SolutionNodeMatch {
  override def certainty: Option[Double] = maybeCertainty.map(_.rate)
}

object TestTreeMatcher extends TreeMatcher {

  override type SolNodeMatch = TestSolutionNodeMatch

  override protected def createSolutionNodeMatch(
    sampleNodeId: Int,
    userNodeId: Int,
    matchStatus: MatchStatus,
    certainty: Option[WordMatcher.WordMatchingResult]
  ): SolNodeMatch = TestSolutionNodeMatch(sampleNodeId, userNodeId, matchStatus, certainty)

}

class TreeMatcherTest extends AsyncFlatSpec with Matchers {

  val username   = "user"
  val exerciseId = 1

  behavior of "TreeMatcher"

  private def flatNode(id: Int, childIndex: Int, text: String, applicability: Applicability, parentId: Option[Int]): FlatSampleSolutionNode =
    FlatSampleSolutionNode(id, childIndex, isSubText = false, text, applicability, parentId)

  private val sampleNodes: Seq[FlatSampleSolutionNode] = Seq(
    flatNode(0, 0, "Sachentscheidungsvoraussetzungen / Zulässigkeit", Applicable, None),
    flatNode(1, 0, "Eröffnung des VRW", Applicable, Some(0)),
    flatNode(2, 0, "Keine Sonderzuweisung", Applicable, Some(1)),
    flatNode(3, 1, "Generalklausel § 40 I 1 VwGO", Applicable, Some(1)),
    flatNode(4, 0, "Ör Streitigkeit", Applicable, Some(3)),
    flatNode(5, 1, "Trotz irreführendem Wortlaut nichtverfassungsrechtlichen Art", Applicable, Some(3)),
    flatNode(6, 2, "Keine abdrängende Sonderzuweisung", Applicable, Some(3)),
    flatNode(7, 1, "Statthafte Klageart, allgemeine Feststellungsklage § 43 I VwGO", Applicable, Some(0)),
    flatNode(8, 0, "Kommunalverfassungsstreit als Klage sui generis", NotApplicable, Some(7)),
    flatNode(9, 1, "Anfechtungsklage, § 42 I Var. 1 VwGO", NotApplicable, Some(7)),
    flatNode(10, 2, "Allgemeine Leistungsklage, Arg. e. § 43 II, 113 IV VwGO", NotApplicable, Some(7)),
    flatNode(11, 3, "Gestaltungsklage", NotApplicable, Some(7)),
    flatNode(12, 4, "Allgemeine Feststellungsklage, § 43 I VwGO", Applicable, Some(7)),
    flatNode(13, 2, "Feststellungsinteresse, §43 I VwGO", Applicable, Some(0)),
    flatNode(14, 3, "Klagebefugnis, § 42 II VwGO analog", Applicable, Some(0)),
    flatNode(15, 4, "Beteiligten- und Prozessfähigkeit, §§ 61 ff. VwGO", Applicable, Some(0)),
    flatNode(16, 0, "Kläger H:", Applicable, Some(15)),
    flatNode(17, 0, "Beteiligtenfähigkeit", Applicable, Some(16)),
    flatNode(18, 1, "Prozessfähigkeit", Applicable, Some(16)),
    flatNode(19, 1, "Beklagte", Applicable, Some(15)),
    flatNode(20, 0, "Beteiligtenfähigkeit str.", Applicable, Some(19)),
    flatNode(21, 1, "Prozessfähigkeit", Applicable, Some(19)),
    flatNode(22, 5, "Allgemeines Rechtsschutzinteresse", Applicable, Some(0)),
    flatNode(23, 6, "Ordnungsgemäße Klageerhebung", NotSpecified, Some(0)),
    flatNode(24, 7, "Zuständigkeit", Applicable, Some(0)),
    flatNode(25, 8, "Zwischenergebnis", Applicable, Some(0)),
    flatNode(26, 1, "Begründetheit", NotApplicable, None),
    flatNode(27, 0, "Passivlegitimation", Applicable, Some(26)),
    flatNode(28, 1, "Rechtswidrigkeit/Unwirksamkeit des Beschlusses", NotApplicable, Some(26)),
    flatNode(29, 0, "Rechtswidrigkeit der Teilnahme des F", Applicable, Some(28)),
    flatNode(30, 1, "Resultierende Rechtswidrigkeit des Beschlusses", NotApplicable, Some(28)),
    flatNode(31, 2, "Verletzung eines Organrechts", NotApplicable, Some(26)),
    flatNode(32, 3, "Zwischenergebnis", NotApplicable, Some(26)),
    flatNode(33, 2, "Ergebnis", NotSpecified, None)
  )

  private val userNodes: Seq[FlatSampleSolutionNode] = Seq(
    flatNode(0, 0, "Zulässigkeit", Applicable, None),
    flatNode(1, 0, "Eröffnung des VRW", Applicable, Some(0)),
    flatNode(2, 0, "Aufdrängende Sonderzuweisung", NotApplicable, Some(1)),
    flatNode(3, 1, "Generalklausel, § 40 I 1 VwGO", Applicable, Some(1)),
    flatNode(4, 0, "Öffentlich-rechtliche Streitigkeit", Applicable, Some(3)),
    flatNode(5, 1, "Nichtverfassungsrechtlicher Art", Applicable, Some(3)),
    flatNode(6, 2, "Keine abdrängende Sonderzuweisung", Applicable, Some(3)),
    flatNode(7, 1, "Statthafte Klageart *", Applicable, Some(0)),
    flatNode(8, 0, "Anfechtungsklage, § 42 I Alt. 1 VwGO", NotApplicable, Some(7)),
    flatNode(9, 0, "VA", NotApplicable, Some(8)),
    flatNode(10, 1, "Allgemeine Leistungsklage mit kassatorischer Wirkung", NotApplicable, Some(7)),
    flatNode(11, 0, "Kein VA", Applicable, Some(10)),
    flatNode(12, 1, "Klägerisches Begehren, § 88 VwGO", Applicable, Some(10)),
    flatNode(13, 2, "Nicht erledigte Maßnahme", NotApplicable, Some(10)),
    flatNode(14, 2, "Allgemeine Feststellungsklage, § 43 I VwGO", Applicable, Some(7)),
    flatNode(15, 0, "Klagebegehren", Applicable, Some(14)),
    flatNode(16, 1, "H möchte auch hilfsweise die Ungültigkeit der Abstimmung feststellen lassen", NotSpecified, Some(14)),
    flatNode(17, 2, "Erledigung", Applicable, Some(14)),
    flatNode(18, 2, "Klagebefugnis, analog § 42 II VwGO", Applicable, Some(0)),
    flatNode(19, 3, "Zuständigkeit des Gerichts", Applicable, Some(0)),
    flatNode(20, 0, "Sachliche Zuständigkeit, § 45 VwGO", Applicable, Some(19)),
    flatNode(21, 1, "Örtliche Zuständigkeit, § 52 VwGO", Applicable, Some(19)),
    flatNode(22, 4, "Beteiligten- und Prozessfähigkeit", Applicable, Some(0)),
    flatNode(23, 0, "Gemeinderatsmitglied H", Applicable, Some(22)),
    flatNode(24, 0, "Beteiligtenfähig: H, analog § 61 Nr. 2 VwGO", NotSpecified, Some(23)),
    flatNode(25, 1, "Prozessfähig: H als Organ, analog § 62 I Nr. 1 VwGO", NotSpecified, Some(23)),
    flatNode(26, 1, "Gemeinde K", Applicable, Some(22)),
    flatNode(27, 0, "Beteiligtenfähig: K, § 61 Nr. 1 Alt. 2 VwGO, Art. 1 GO", NotSpecified, Some(26)),
    flatNode(28, 1, "Prozessfähig: § 62 III VwGO, Art. 38 I, 37 I 1 Nr. 1, 34 I 2, 29 GO", NotSpecified, Some(26)),
    flatNode(29, 5, "Feststellungsinteresse, § 43 I VwGO *", Applicable, Some(0)),
    flatNode(30, 0, "Konkrete Wiederholungsgefahr", NotApplicable, Some(29)),
    flatNode(31, 1, "Rehabilitatiosinteresse", Applicable, Some(29)),
    flatNode(32, 6, "Entbehrlichkeit des Vorverfahrens", Applicable, Some(0)),
    flatNode(33, 7, "Klagefrist", Applicable, Some(0)),
    flatNode(34, 8, "Form, § 81 I VwGO ", Applicable, Some(0)),
    flatNode(35, 9, "Allgemeines Rechtsschutzbedürfnis", Applicable, Some(0)),
    flatNode(36, 1, "Begründetheit", Applicable, None),
    flatNode(37, 0, "Passivlegitimation", Applicable, Some(36)),
    flatNode(38, 1, "Rechtmäßigkeit des Gemeinderatsbeschlusses", Applicable, Some(36)),
    flatNode(39, 0, "Formelle RMK", Applicable, Some(38)),
    flatNode(40, 0, "Zuständigkeit", Applicable, Some(39)),
    flatNode(41, 0, "Verbandskompetenz", Applicable, Some(40)),
    flatNode(42, 1, "Organkompetenz", Applicable, Some(40)),
    flatNode(43, 1, "Verfahren und Form", Applicable, Some(39)),
    flatNode(44, 0, "Beschlussfähigkeit, Art. 47 II GO ", Applicable, Some(43)),
    flatNode(45, 1, "Ordnungsgemäße Beschlussfassung, Art. 45ff. GO", Applicable, Some(43)),
    flatNode(46, 0, "Anwendungsbereich", Applicable, Some(45)),
    flatNode(47, 1, "Gemeinderatsmitglied", Applicable, Some(45)),
    flatNode(
      48,
      2,
      "Potenzieller Vor- oder Nachteil rechtlicher, wirtschaftlicher, ideeller oder persönlicher Art",
      Applicable,
      Some(45)
    ),
    flatNode(49, 3, "Begünstigung oder Belastung als unmittelbare Folge des Beschlusses", Applicable, Some(45)),
    flatNode(
      50,
      4,
      "Der Arbeitsplatz des F könnte bedroht sein. Er ist auch nicht nur als Mitglied einer Berufsgruppe betroffen, sondern sein konkreter Arbeitsplatz. Damit ist kein Gruppenvorteil, sondern ein individuelles Sonderinteresse anzunehmen.",
      NotSpecified,
      Some(45)
    ),
    flatNode(51, 2, "Unwirksamkeit des Beschlusses, Art. 49 IV GO", NotApplicable, Some(43)),
    flatNode(52, 1, "Materieller RMK", Applicable, Some(38)),
    flatNode(53, 0, "Kein Verstoß gegen höherrangiges Recht", Applicable, Some(52)),
    flatNode(54, 2, "Zwischenergebnis", Applicable, Some(36)),
    flatNode(55, 2, "Ergebnis", NotApplicable, None)
  )

  private implicit def string2WordWithRealtedWords(value: String): WordWithRelatedWords = {
    val maybeRelatedWords = relatedWordGroups
      .find { _.map { _.word } contains value }
      .getOrElse { Seq.empty }
      .filter { _.word != value }

    WordWithRelatedWords(value, maybeRelatedWords)
  }

  private implicit def tuple2NodeIdMatch(t: (Int, Int)): TestSolutionNodeMatch =
    TestSolutionNodeMatch(t._1, t._2, MatchStatus.Automatic, None)

  private implicit def triple2NodeIdMatch(t: ((Int, Int), MatchingResult[WordWithRelatedWords, FuzzyWordMatchExplanation])): TestSolutionNodeMatch = t match {
    case ((sampleNodeId, userNodeId), strMatchingResult) =>
      TestSolutionNodeMatch(sampleNodeId, userNodeId, MatchStatus.Automatic, Some(strMatchingResult))
  }

  private def matchingResult(
    matches: Seq[Match[WordWithRelatedWords, FuzzyWordMatchExplanation]],
    notMatchedSample: Seq[WordWithRelatedWords] = Seq.empty,
    notMatchedUser: Seq[WordWithRelatedWords] = Seq.empty
  ): MatchingResult[WordWithRelatedWords, FuzzyWordMatchExplanation] = MatchingResult(matches, notMatchedSample, notMatchedUser)

  private val awaited = Seq[TestSolutionNodeMatch](
    // "Sachentscheidungsvoraussetzungen / Zulässigkeit" <-> "Zulässigkeit"
    0 -> 0 -> matchingResult(
      matches = Seq(
        Match("zulässigkeit", "zulässigkeit")
      ),
      notMatchedSample = Seq("sachentscheidungsvoraussetzungen")
    ),
    // "Eröffnung des VRW" <-> "Eröffnung des VRW"
    1 -> 1,
    // "Keine Sonderzuweisung" <-> "Aufdrängende Sonderzuweisung"
    2 -> 2 -> matchingResult(
      matches = Seq(
        Match("sonderzuweisung", "sonderzuweisung")
      ),
      notMatchedSample = Seq("keine"),
      notMatchedUser = Seq("aufdrängende")
    ),
    // "Generalklausel § 40 I 1 VwGO" <-> "Generalklausel, § 40 I 1 VwGO"
    3 -> 3 -> matchingResult(
      matches = Seq(
        Match("generalklausel", "generalklausel"),
        Match("vwgo", "vwgo")
      )
    ),
    // "Ör Streitigkeit" <-> "Öffentlich-rechtliche Streitigkeit"
    4 -> 4 -> matchingResult(
      matches = Seq(
        Match("öffentlichrechtliche", "öffentlichrechtliche"),
        Match("streitigkeit", "streitigkeit")
      )
    ),
    // "Trotz irreführendem Wortlaut nichtverfassungsrechtlichen Art" <-> "Nichtverfassungsrechtlicher Art"
    5 -> 5 -> matchingResult(
      matches = Seq(
        Match("art", "art"),
        Match("nichtverfassungsrechtlichen", "nichtverfassungsrechtlicher", Some(FuzzyWordMatchExplanation(1, 27)))
      ),
      notMatchedSample = Seq("trotz", "irreführendem", "wortlaut")
    ),
    // "Keine abdrängende Sonderzuweisung" <-> "Keine abdrängende Sonderzuweisung"
    6 -> 6,
    // "Statthafte Klageart, allgemeine Feststellungsklage § 43 I VwGO" <-> "Statthafte Klageart *"
    7 -> 7 -> matchingResult(
      matches = Seq(
        Match("statthafte", "statthafte"),
        Match("klageart", "klageart")
      ),
      notMatchedSample = Seq("allgemeine", "feststellungsklage", "vwgo")
    ),
    // "Anfechtungsklage, § 42 I Var. 1 VwGO" <-> "Anfechtungsklage, § 42 I Alt. 1 VwGO"
    9 -> 8 -> matchingResult(
      matches = Seq(
        Match("anfechtungsklage", "anfechtungsklage"),
        Match("vwgo", "vwgo")
      )
    ),
    // "Allgemeine Leistungsklage, Arg. e. § 43 II, 113 IV VwGO" <-> "Allgemeine Leistungsklage mit kassatorischer Wirkung"
    10 -> 10 -> matchingResult(
      matches = Seq(
        Match("allgemeine", "allgemeine"),
        Match("leistungsklage", "leistungsklage")
      ),
      notMatchedSample = Seq("vwgo", "arg.", "iv"),
      notMatchedUser = Seq("mit", "kassatorischer", "wirkung")
    ),
    // "Allgemeine Feststellungsklage, § 43 I VwGO" <-> "Allgemeine Feststellungsklage, § 43 I VwGO"
    12 -> 14,
    // "Feststellungsinteresse, §43 I VwGO" <-> "Feststellungsinteresse, § 43 I VwGO *"
    13 -> 29 -> matchingResult(
      matches = Seq(
        Match("feststellungsinteresse", "feststellungsinteresse"),
        Match("vwgo", "vwgo")
      )
    ),
    // "Klagebefugnis, § 42 II VwGO analog" <-> "Klagebefugnis, analog § 42 II VwGO"
    14 -> 18 -> matchingResult(
      matches = Seq(
        Match("klagebefugnis", "klagebefugnis"),
        Match("vwgo", "vwgo"),
        Match("analog", "analog")
      )
    ),
    // "Beteiligten- und Prozessfähigkeit, §§ 61 ff. VwGO" <-> "Beteiligten- und Prozessfähigkeit"
    15 -> 22 -> matchingResult(
      matches = Seq(
        Match("beteiligten", "beteiligten"),
        Match("und", "und"),
        Match("prozessfähigkeit", "prozessfähigkeit")
      ),
      notMatchedSample = Seq("vwgo"),
      notMatchedUser = Seq()
    ),
    // "Allgemeines Rechtsschutzinteresse" <-> Allgemeines Rechtsschutzbedürfnis"
    22 -> 35 -> matchingResult(
      matches = Seq(
        Match("allgemeines", "allgemeines"),
        Match("rechtsschutzinteresse", "rechtsschutzbedürfnis")
      )
    ),
    // "Zuständigkeit" <-> "Zuständigkeit des Gerichts"
    24 -> 19 -> matchingResult(
      matches = Seq(Match("zuständigkeit", "zuständigkeit")),
      notMatchedUser = Seq("des", "gerichts")
    ),
    // "Begründetheit" <-> "Begründetheit"
    26 -> 36,
    // "Passivlegitimation" <-> "Passivlegitimation"
    27 -> 37,
    // "Rechtswidrigkeit/Unwirksamkeit des Beschlusses" <-> "Rechtmäßigkeit des Gemeinderatsbeschlusses"
    28 -> 38 -> matchingResult(
      matches = Seq(
        // Match("rechtswidrigkeit", "rechtmäßigkeit"),
        Match("des", "des")
      ),
      notMatchedSample = Seq("rechtswidrigkeit", "beschlusses"),
      notMatchedUser = Seq("rechtmäßigkeit", "gemeinderatsbeschlusses")
    ),
    // "Zwischenergebnis" <-> "Zwischenergebnis"
    32 -> 54,
    // "Ergebnis" <-> "Ergebnis"
    33 -> 55
  )

  private val nodeIdMatchFormat: Writes[TestSolutionNodeMatch] = {
    @unused implicit val relatedWordWrites: Writes[RelatedWord]               = (value) => Json.obj("word" -> value.word, "isPositive" -> value.isPositive)
    @unused implicit val wordWithSynonymsWrites: Writes[WordWithRelatedWords] = Json.writes
    @unused implicit val fuzzyWordMatchExplanationWrites: Writes[FuzzyWordMatchExplanation]                       = Json.writes
    @unused implicit val extractedWordMatchWrites: Writes[Match[WordWithRelatedWords, FuzzyWordMatchExplanation]] = Json.writes
    @unused implicit val wordMatchingResultWrites: Writes[WordMatcher.WordMatchingResult]                         = Json.writes

    Json.writes
  }

  private val abbreviations = Map(
    "ör"  -> "öffentlichrechtlich",
    "vrw" -> "verwaltungsrechtsweg",
    "rw"  -> "rechtswidrigkeit"
  )

  private val synonyms = Map(
    "sachentscheidungsvoraussetzungen" -> Seq("zulässigkeit")
  )

  private lazy val relatedWordGroups = Seq(
    Seq(
      TestRelatedWord("sachentscheidungsvoraussetzungen", isPositive = true),
      TestRelatedWord("zulässigkeit", isPositive = true)
    )
  )

  private def resolveSynonyms(value: String): Future[Seq[String]] = Future.successful {
    synonyms.getOrElse(value, Seq.empty)
  }

  it should "match trees" in {

    // noinspection SpellCheckingInspection
    implicit lazy val prettifier: Prettifier = {
      case sequence: Seq[_]         => sequence.map(prettifier.apply).mkString("[\n", "\n", "\n]")
      case n: TestSolutionNodeMatch => Json.prettyPrint(Json.toJson(n)(nodeIdMatchFormat))
      case o                        => Prettifier.default.apply(o)
    }

    val result = TestTreeMatcher
      .performMatching(sampleNodes, userNodes, abbreviations, relatedWordGroups)
      .sortBy(_.sampleNodeId)

    val resultFile: File  = file"./result.json"
    val awaitedFile: File = file"./awaited.json"

    val jsonWrites = Writes.seq(nodeIdMatchFormat)

    resultFile.overwrite(Json.prettyPrint(jsonWrites.writes(result)))
    awaitedFile.overwrite(Json.prettyPrint(jsonWrites.writes(awaited)))

    result shouldEqual awaited
  }

}
