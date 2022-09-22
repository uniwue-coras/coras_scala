name         := """coras"""
organization := "de.uniwue.is"
version      := "1.0-SNAPSHOT"
scalaVersion := "2.13.9"

lazy val root = (project in file("."))
  .enablePlugins(PlayScala, ScalaTsiPlugin)
  .settings(
    Universal / packageName := s"${name.value}",
    // Scala tsi
    typescriptExports := Seq(
      "model.DocxText",
      "model.SolutionNode",
      "model.SolutionNodeMatchingResult"
    ),
    typescriptGenerationImports := Seq("model.MyTsTypes._"),
    typescriptOutputFile        := baseDirectory.value / "ui" / "src" / "myTsModels.ts",
    typescriptStyleSemicolons   := true
  )

PlayKeys.playDefaultPort := 9016

val poiVersion        = "5.2.3"
val enumeratumVersion = "1.7.0"
val playSlickVersion  = "5.0.2"
val slickPgVersion    = "0.20.4"

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
  "com.github.jwt-scala" %% "jwt-play" % "9.1.1", // Apache 2.0

  // Postgres
  "org.postgresql"       % "postgresql"            % "42.5.0",         // BSD-2
  "com.typesafe.play"   %% "play-slick"            % playSlickVersion, // Apache 2.0
  "com.typesafe.play"   %% "play-slick-evolutions" % playSlickVersion, // Apache 2.0
  "com.github.tminglei" %% "slick-pg"              % slickPgVersion,   // BSD-2
  "com.github.tminglei" %% "slick-pg_play-json"    % slickPgVersion,   // BSD-2

  // GraphQL
  "org.sangria-graphql" %% "sangria"           % "3.2.0", // Apache 2.0
  "org.sangria-graphql" %% "sangria-play-json" % "2.0.2", // Apache 2.0

  // Testing
  "org.scalatestplus.play" %% "scalatestplus-play" % "5.1.0" % Test
)
