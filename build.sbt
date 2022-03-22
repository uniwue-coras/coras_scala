name         := """coras"""
organization := "de.uniwue.is"
version      := "1.0-SNAPSHOT"
scalaVersion := "2.13.8"

lazy val root = (project in file("."))
  .enablePlugins(PlayScala, ScalaTsiPlugin)
  .settings(
    typescriptExports           := Seq("model.DocxText"),
    typescriptOutputFile        := baseDirectory.value / "ui" / "src" / "myTsModels.ts",
    typescriptGenerationImports := Seq("model.DocxText._")
  )

PlayKeys.playDefaultPort := 9016

val poiVersion        = "5.2.2"
val enumeratumVersion = "1.7.0"
val playSlickVersion  = "5.0.0"

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
  "com.github.jwt-scala" %% "jwt-play-json" % "9.0.5", // Apache 2.0

  // PostgreSQL
  "org.postgresql"     % "postgresql"            % "42.3.3",         // BSD-2
  "com.typesafe.play" %% "play-slick"            % playSlickVersion, // Apache 2.0
  "com.typesafe.play" %% "play-slick-evolutions" % playSlickVersion, // Apache 2.0

  // File support
  "com.github.pathikrit" %% "better-files" % "3.9.1", // MIT

  // GraphQL
  "org.sangria-graphql" %% "sangria"           % "3.0.0", // Apache 2.0
  "org.sangria-graphql" %% "sangria-play-json" % "2.0.2", // Apache 2.0

  // Testing
  "org.scalatestplus.play" %% "scalatestplus-play" % "5.1.0" % Test
)
