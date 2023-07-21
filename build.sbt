name         := """coras"""
organization := "de.uniwue.is"
version      := "0.2.1"
scalaVersion := "2.13.11"

lazy val root = (project in file("."))
  .enablePlugins(PlayScala, ScalaTsiPlugin)
  .settings(
    Universal / packageName := s"${name.value}",
    // Scala tsi
    typescriptExports         := Seq("model.docxReading.DocxText"),
    typescriptOutputFile      := baseDirectory.value / "ui" / "src" / "myTsModels.ts",
    typescriptStyleSemicolons := true
  )

Universal / mappings ++= Seq(
  (baseDirectory.value / "docker-compose.yaml")       -> "docker-compose.yaml",
  (baseDirectory.value / "init.sql")                  -> "init.sql",
  (baseDirectory.value / "data" / "default_data.sql") -> "default_data.sql"
)

PlayKeys.playDefaultPort := 9016

val poiVersion        = "5.2.3"
val enumeratumVersion = "1.7.3"
val playSlickVersion  = "5.1.0"

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
  "com.github.jwt-scala" %% "jwt-play" % "9.4.3", // Apache 2.0

  // Database
  "org.mariadb.jdbc" % "mariadb-java-client" % "3.1.4", // LGPL 2.1

  "com.typesafe.play" %% "play-slick"            % playSlickVersion, // Apache 2.0
  "com.typesafe.play" %% "play-slick-evolutions" % playSlickVersion, // Apache 2.0

  // GraphQL
  "org.sangria-graphql" %% "sangria"           % "4.0.1", // Apache 2.0
  "org.sangria-graphql" %% "sangria-play-json" % "2.0.2", // Apache 2.0

  // Testing
  "org.scalatestplus.play" %% "scalatestplus-play" % "5.1.0" % Test
)
