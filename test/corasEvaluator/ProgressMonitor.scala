package corasEvaluator

import me.tongfei.progressbar.ProgressBar

class ProgressMonitor(printProgress: Boolean, count: Int):

  val pb = ProgressBar("Finished", count)

  def updateMappingProgress() = this.synchronized {
    pb.step()
  }
