package corasEvaluator

final case class CliArgs(
  dataFile: String = ""
)

object CliArgsParser extends scopt.OptionParser[CliArgs]("CorasEvaluator") {
  head("corasEvaluator", "0.0.1")

  arg[String]("dataFile")
    .required()
    .text("Json file with data to evaluate")
    .action((dataFile, cliArgs) => cliArgs.copy(dataFile = dataFile))
}
