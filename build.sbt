val poiVersion        = "5.2.4"
val enumeratumVersion = "1.7.3"
val playSlickVersion  = "5.1.0"
val playJsonVersion   = "3.0.0"

val playJsonDependency = "org.playframework" %% "play-json" % playJsonVersion

val commonSettings = Seq(
  scalaVersion := "2.13.12",
  organization := "de.uniwue.ls6",
  version      := "0.2.1",
  libraryDependencies ++= Seq(
    // Enums
    "com.beachape" %% "enumeratum-play"      % enumeratumVersion, // MIT
    "com.beachape" %% "enumeratum-play-json" % enumeratumVersion, // MIT

    // Testing
    "org.scalatestplus.play" %% "scalatestplus-play" % "7.0.0" % Test
  ),
  semanticdbEnabled := true,
  semanticdbVersion := scalafixSemanticdb.revision,
  scalacOptions ++= Seq("-deprecation", "-feature", "-Wunused" /* Scala 2.x only, required by `RemoveUnused`*/ )
)

lazy val model = (project in file("./corasModel"))
  .settings(commonSettings)
  .settings(
    name := "model",
    libraryDependencies ++= Seq(
      playJsonDependency,
      "com.github.pathikrit" %% "better-files" % "3.9.2"
    )
  )

lazy val evaluator = (project in file("./corasEvaluator"))
  .dependsOn(model)
  .settings(commonSettings)
  .settings(
    name       := "evaluator",
    run / fork := true,
    libraryDependencies ++= Seq(
      playJsonDependency,
      "com.github.pathikrit" %% "better-files" % "3.9.2",
      "com.github.scopt"     %% "scopt"        % "4.1.0"
    )
  )

lazy val root = (project in file("."))
  .enablePlugins(PlayScala, ScalaTsiPlugin)
  .aggregate(model)
  .dependsOn(model)
  .settings(commonSettings)
  .settings(
    name                    := "coras",
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

libraryDependencies ++= Seq(
  guice,

  // POI
  "org.apache.poi" % "poi"       % poiVersion,
  "org.apache.poi" % "poi-ooxml" % poiVersion,

  // BCrypt
  "com.github.t3hnar" %% "scala-bcrypt" % "4.3.0", // Apache 2.0

  // JWT
  "com.github.jwt-scala" %% "jwt-play" % "9.4.4", // Apache 2.0

  // Database
  "org.mariadb.jdbc" % "mariadb-java-client" % "3.2.0", // LGPL 2.1

  "com.typesafe.play" %% "play-slick"            % playSlickVersion, // Apache 2.0
  "com.typesafe.play" %% "play-slick-evolutions" % playSlickVersion, // Apache 2.0

  // GraphQL
  "org.sangria-graphql" %% "sangria"           % "4.0.2", // Apache 2.0
  "org.sangria-graphql" %% "sangria-play-json" % "2.0.2"  // Apache 2.0

)
