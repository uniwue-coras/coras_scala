package corasEvaluator

import scopt.OptionParser

final case class CliArgs(
  onlyParagraphMatching: Boolean = false
)

object CliArgsParser extends OptionParser[CliArgs]("corasEvaluator"):
  head("corasEvaluator")

  opt[Unit]("paragraphsOnly")
    .action((_, c) => c.copy(onlyParagraphMatching = true))
    .text("Only match paragraphs")
