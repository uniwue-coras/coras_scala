package corasEvaluator

import me.tongfei.progressbar.ProgressBar

class ProgressMonitor(printProgress: Boolean, count: Int):
  private var initialMatchingProgress: Int    = 0
  private var matchingEvaluationProgress: Int = 0
  private var mappingProgress: Int            = 0

  val pb = ProgressBar("Finished", count)

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
    pb.step()
    printUpdate()
  }

  private def printUpdate() = if printProgress then println(s"$initialMatchingProgress / $matchingEvaluationProgress / $mappingProgress")
