name         := """coras"""
organization := "de.uniwue.is"
version      := "1.0-SNAPSHOT"
scalaVersion := "2.13.8"

lazy val root = (project in file("."))
  .enablePlugins(PlayScala, ScalaTsiPlugin)
  .settings(
    Universal / packageName := s"${name.value}",
    typescriptExports := Seq(
      "model.DocxText",
      "model.SolutionNode",
      "model.CorrectionValues",
      "model.SolutionNodeMatchingResult"
    ),
    typescriptOutputFile        := baseDirectory.value / "ui" / "src" / "myTsModels.ts",
    typescriptGenerationImports := Seq("model.MyTsTypes._"),
    typescriptStyleSemicolons   := true
  )

PlayKeys.playDefaultPort := 9016

val poiVersion        = "5.2.2"
val enumeratumVersion = "1.7.0"
val playSlickVersion  = "5.0.2"

libraryDependencies ++= Seq(
  guice,

  // POI
  "org.apache.poi" % "poi"       % poiVersion,
  "org.apache.poi" % "poi-ooxml" % poiVersion,

  // Enums
  "com.beachape" %% "enumeratum-play"      % enumeratumVersion, // MIT
  "com.beachape" %% "enumeratum-play-json" % enumeratumVersion, // MIT

  // BCrypt
  "com.github.t3hnar" %% "scala-bcrypt" % "4.3.0", // Apache 2.0

  // JWT
  "com.github.jwt-scala" %% "jwt-play-json" % "9.1.0", // Apache 2.0

  // Mongo database
  "org.reactivemongo" %% "play2-reactivemongo"            % "1.1.0-play28-RC6", // Apache 2.0
  "org.reactivemongo" %% "reactivemongo-play-json-compat" % "1.1.0-play29-RC6", // Apache 2.0

  // MariaDB
  "org.postgresql"       % "postgresql"            % "42.4.2",         // BSD-2
  "com.github.tminglei" %% "slick-pg"              % "0.20.4",         // BSD-2
  "com.github.tminglei" %% "slick-pg_play-json"    % "0.20.4",         // BSD-2
  "com.typesafe.play"   %% "play-slick"            % playSlickVersion, // Apache 2.0
  "com.typesafe.play"   %% "play-slick-evolutions" % playSlickVersion, // Apache 2.0

  // File support
  "com.github.pathikrit" %% "better-files" % "3.9.1", // MIT

  // GraphQL
  "org.sangria-graphql" %% "sangria"           % "3.2.0", // Apache 2.0
  "org.sangria-graphql" %% "sangria-play-json" % "2.0.2", // Apache 2.0

  // Testing
  "org.scalatestplus.play" %% "scalatestplus-play" % "5.1.0" % Test
)
