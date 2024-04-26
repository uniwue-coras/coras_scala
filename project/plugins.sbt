// Use scala-xml 2.x for compatibility with sbt 1.8.x
ThisBuild / libraryDependencySchemes += "org.scala-lang.modules" %% "scala-xml" % VersionScheme.Always

addSbtPlugin("com.typesafe.play" % "sbt-plugin" % "2.8.12")

addSbtPlugin("com.timushev.sbt" % "sbt-updates" % "0.6.4")

addSbtPlugin("com.scalatsi" % "sbt-scala-tsi" % "0.8.3")

addSbtPlugin("ch.epfl.scala" % "sbt-scalafix" % "0.12.0")

addSbtPlugin("org.scalameta" % "sbt-scalafmt" % "2.5.2")

addDependencyTreePlugin
