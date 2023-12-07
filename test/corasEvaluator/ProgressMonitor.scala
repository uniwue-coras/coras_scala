package corasEvaluator

object ProgressMonitor:
  private var initialMatchingProgress: Int    = 0
  private var matchingEvaluationProgress: Int = 0
  private var mappingProgress: Int            = 0

  def updateInitialMatchingProgress() = this.synchronized {
    this.initialMatchingProgress += 1
    printUpdate()
  }

  def updateMatchingEvaluationProgress() = this.synchronized {
    this.matchingEvaluationProgress += 1
    printUpdate()
  }

  def updateMappingProgress() = this.synchronized {
    this.mappingProgress += 1
  }

  private def printUpdate() = println(s"$initialMatchingProgress / $matchingEvaluationProgress / $mappingProgress")
