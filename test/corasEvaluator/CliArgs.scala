package corasEvaluator

import scopt.OptionParser

final case class CliArgs(
  onlyParagraphMatching: Boolean = false,
  printIndividualNumbers: Boolean = false,
  writeIndividualFiles: Boolean = false
)

object CliArgsParser extends OptionParser[CliArgs]("corasEvaluator") {
  head("corasEvaluator")

  opt[Unit]("paragraphsOnly")
    .action((_, c) => c.copy(onlyParagraphMatching = true))
    .text("Only match paragraphs")

  opt[Unit]("i")
    .action((_, c) => c.copy(printIndividualNumbers = true))
    .text("Display individual numbers")

  opt[Unit]("w")
    .action((_, c) => c.copy(writeIndividualFiles = true))
    .text("Write json debug files")
}
