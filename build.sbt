name         := "coras"
scalaVersion := "2.13.12"
organization := "de.uniwue.ls6"
version      := "0.2.1"

semanticdbEnabled := true
semanticdbVersion := scalafixSemanticdb.revision
scalacOptions ++= Seq("-deprecation", "-feature", "-Wunused" /* Scala 2.x only, required by `RemoveUnused`*/ )

// buid to coras.tar.gz (without version suffix)
Universal / packageName := s"${name.value}"

lazy val root = (project in file("."))
  .enablePlugins(PlayScala, ScalaTsiPlugin)
  .settings(
    // Scala tsi
    typescriptExports         := Seq("model.docxReading.DocxText"),
    typescriptOutputFile      := baseDirectory.value / "ui" / "src" / "myTsModels.ts",
    typescriptStyleSemicolons := true
  )

Universal / mappings ++= Seq(
  // Include *important* files in tar.gz
  (baseDirectory.value / "docker-compose.yaml")       -> "docker-compose.yaml",
  (baseDirectory.value / "init.sql")                  -> "init.sql",
  (baseDirectory.value / "data" / "default_data.sql") -> "default_data.sql"
)

PlayKeys.playDefaultPort := 9016

commands += Command.single("evaluate") { (state, file) =>
  s"Test/run $file" :: state
}

val poiVersion       = "5.2.4"
val playSlickVersion = "6.0.0-M2"

libraryDependencies ++= Seq(
  guice,

  // POI
  "org.apache.poi" % "poi"       % poiVersion,
  "org.apache.poi" % "poi-ooxml" % poiVersion,

  // BCrypt
  "com.github.t3hnar" %% "scala-bcrypt" % "4.3.0", // Apache 2.0

  // JWT
  "com.github.jwt-scala" %% "jwt-play-json" % "9.4.4", // Apache 2.0

  // Database
  "org.mariadb.jdbc" % "mariadb-java-client" % "3.2.0", // LGPL 2.1

  "org.playframework" %% "play-slick"            % playSlickVersion, // Apache 2.0
  "org.playframework" %% "play-slick-evolutions" % playSlickVersion, // Apache 2.0

  // GraphQL
  "org.sangria-graphql" %% "sangria"           % "4.0.2", // Apache 2.0
  "org.sangria-graphql" %% "sangria-play-json" % "2.0.2", // Apache 2.0

// Enums
  "com.beachape" %% "enumeratum-play" % "1.7.3", // MIT

  // Evaluation
  "com.github.pathikrit" %% "better-files" % "3.9.2" % Test,
  "com.github.scopt"     %% "scopt"        % "4.1.0" % Test,

  // Testing
  "org.scalatestplus.play" %% "scalatestplus-play" % "7.0.0" % Test
)
