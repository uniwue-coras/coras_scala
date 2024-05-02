package corasEvaluator

import me.tongfei.progressbar.ProgressBar

class ProgressMonitor(count: Int) {
  private val pb = ProgressBar("Finished", count)

  def updateMappingProgress() = this.synchronized {
    this.pb.step()
  }
}
