package model.matching

import model.Applicability._
import model.{Applicability, FlatSolutionNode}
import org.scalactic.Prettifier
import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.matchers.should.Matchers
import play.api.libs.json.{Json, Writes}

import scala.language.implicitConversions

class TreeMatcherTest extends AnyFlatSpec with Matchers {

  behavior of "TreeMatcher"

  private def flatNode(id: Int, childIndex: Int, text: String, applicability: Applicability, parentId: Option[Int]): FlatSolutionNode =
    FlatSolutionNode(None, 0, id, childIndex, text, applicability, parentId)

  private val sampleNodes: Seq[FlatSolutionNode] = Seq(
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

  private val userNodes: Seq[FlatSolutionNode] = Seq(
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

  private implicit def tuple2ExtractedWord(t: (Int, String)): ExtractedWord = ExtractedWord(t._1, t._2)

  private implicit def tuple2NodeIdMatch(t: (Int, Int)): NodeIdMatch = NodeIdMatch(t._1, t._2, None)

  private implicit def triple2NodeIdMatch(t: ((Int, Int), MatchingResult[ExtractedWord, FuzzyWordMatchExplanation])): NodeIdMatch =
    NodeIdMatch(t._1._1, t._1._2, Some(t._2))

  private def matchingResult(
    matches: Seq[Match[ExtractedWord, FuzzyWordMatchExplanation]],
    notMatchedSample: Seq[ExtractedWord] = Seq.empty,
    notMatchedUser: Seq[ExtractedWord] = Seq.empty
  ): MatchingResult[ExtractedWord, FuzzyWordMatchExplanation] = MatchingResult(matches, notMatchedSample, notMatchedUser)

  private val awaited = Seq[NodeIdMatch](
    // "Sachentscheidungsvoraussetzungen / Zulässigkeit" <-> "Zulässigkeit"
    0 -> 0 -> matchingResult(
      matches = Seq(
        Match(2 -> "zulässigkeit", 0 -> "zulässigkeit")
      ),
      notMatchedSample = Seq(0 -> "sachentscheidungsvoraussetzungen")
    ),
    // "Eröffnung des VRW" <-> "Eröffnung des VRW"
    1 -> 1,
    // "Keine Sonderzuweisung" <-> "Aufdrängende Sonderzuweisung"
    2 -> 2 -> matchingResult(
      matches = Seq(
        Match(1 -> "sonderzuweisung", 1 -> "sonderzuweisung")
      ),
      notMatchedSample = Seq(0 -> "keine"),
      notMatchedUser = Seq(0 -> "aufdrängende")
    ),
    // "Generalklausel § 40 I 1 VwGO" <-> "Generalklausel, § 40 I 1 VwGO"
    3 -> 3 -> matchingResult(
      matches = Seq(
        Match(0 -> "generalklausel", 0 -> "generalklausel"),
        Match(5 -> "vwgo", 5           -> "vwgo")
      )
    ),
    // "Ör Streitigkeit" <-> "Öffentlich-rechtliche Streitigkeit"
    4 -> 4 -> matchingResult(
      matches = Seq(
        Match(1 -> "streitigkeit", 1 -> "streitigkeit")
      )
    ),
    // "Keine abdrängende Sonderzuweisung" <-> "Keine abdrängende Sonderzuweisung"
    6 -> 6,
    // "Statthafte Klageart, allgemeine Feststellungsklage § 43 I VwGO" <-> "Statthafte Klageart *"
    7 -> 7 -> matchingResult(
      matches = Seq(
        Match(0 -> "statthafte", 0 -> "statthafte"),
        Match(1 -> "klageart", 1   -> "klageart")
      ),
      notMatchedSample = Seq(2 -> "allgemeine", 3 -> "feststellungsklage", 7 -> "vwgo")
    ),
    // "Anfechtungsklage, § 42 I Var. 1 VwGO" <-> "Anfechtungsklage, § 42 I Alt. 1 VwGO"
    9 -> 8 -> matchingResult(
      matches = Seq(
        Match(0 -> "anfechtungsklage", 0 -> "anfechtungsklage"),
        Match(6 -> "vwgo", 6             -> "vwgo")
      )
    ),
    // "Allgemeine Leistungsklage, Arg. e. § 43 II, 113 IV VwGO" <-> "Allgemeine Leistungsklage mit kassatorischer Wirkung"
    10 -> 10 -> matchingResult(
      matches = Seq(
        Match(0 -> "allgemeine", 0     -> "allgemeine"),
        Match(1 -> "leistungsklage", 1 -> "leistungsklage")
      ),
      notMatchedSample = Seq(9 -> "vwgo"),
      notMatchedUser = Seq(2 -> "mit", 3 -> "kassatorischer", 4 -> "wirkung")
    )
    // FIXME: verify...
    /*
    13 -> 34 -> MatchingResult[ExtractedWord, Unit](
      matches = Seq(
        Match(3 -> "vwgo", 4 -> "vwgo")
      )
    ),
    14 -> 18 -> MatchingResult[ExtractedWord, Unit](
      matches = Seq(
        Match(4 -> "vwgo", 5   -> "vwgo"),
        Match(5 -> "analog", 1 -> "analog")
      )
    ),
    15 -> 22 -> MatchingResult[ExtractedWord, Unit](
      matches = Seq(Match(1 -> "und", 1 -> "und")),
      notMatchedSample = Seq(6 -> "vwgo"),
      notMatchedUser = Seq(2 -> "prozessfähigkeit")
    ),
    22 -> 35 -> MatchingResult[ExtractedWord, Unit](
      matches = Seq(Match(0 -> "allgemeines", 0 -> "allgemeines")),
      notMatchedSample = Seq(1 -> "rechtsschutzinteresse"),
      notMatchedUser = Seq(1 -> "rechtsschutzbedürfnis")
    ),
    24 -> 19 -> MatchingResult[ExtractedWord, Unit](
      matches = Seq(Match(0 -> "zuständigkeit", 0 -> "zuständigkeit")),
      notMatchedUser = Seq(1 -> "des", 2 -> "gerichts")
    ),
    26 -> 36,
    27 -> 37,
    28 -> 38 -> MatchingResult[ExtractedWord, Unit](
      matches = Seq(Match(1 -> "des", 1 -> "des")),
      notMatchedSample = Seq(2 -> "beschlusses"),
      notMatchedUser = Seq(0 -> "rechtmäßigkeit", 2 -> "gemeinderatsbeschlusses")
    ),
    32 -> 54,
    33 -> 55
     */
  )

  private val nodeIdMatchFormat: Writes[NodeIdMatch] = {
    implicit val fuzzyWordMatchExplanationWrites: Writes[FuzzyWordMatchExplanation]                = Json.writes
    implicit val extractedWordWrites: Writes[ExtractedWord]                                        = Json.writes
    implicit val extractedWordMatchWrites: Writes[Match[ExtractedWord, FuzzyWordMatchExplanation]] = Json.writes
    implicit val wordMatchingResultWrites: Writes[WordMatcher.WordMatchingResult]                  = Json.writes

    Json.writes
  }

  it should "match trees" in {

    implicit lazy val prettifier: Prettifier = {
      case sequence: Seq[_] => sequence.map(prettifier.apply).mkString("[\n", "\n", "\n]")
      case n: NodeIdMatch   => Json.prettyPrint(Json.toJson(n)(nodeIdMatchFormat))
      case o                => Prettifier.default.apply(o)
    }

    TreeMatcher.performMatching(sampleNodes, userNodes).sortBy(_.sampleValue) shouldEqual awaited

  }

}
