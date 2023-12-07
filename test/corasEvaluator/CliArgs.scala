package corasEvaluator

import scopt.OptionParser

final case class CliArgs(
  printIndividualNumbers: Boolean = false,
  writeIndividualFiles: Boolean = false
)

object CliArgsParser extends OptionParser[CliArgs]("corasEvaluator") {
  head("corasEvaluator")

  opt[Unit]("i")
    .action((_, c) => c.copy(printIndividualNumbers = true))

  opt[Unit]("w")
    .action((_, c) => c.copy(writeIndividualFiles = true))
}
