val commonSettings = Seq(
  scalaVersion := "2.13.12",
  organization := "de.uniwue.ls6",
  version      := "0.2.1",
  libraryDependencies ++= Seq(
    // Enums
    "com.beachape" %% "enumeratum-play" % "1.7.3", // MIT
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
      "org.playframework"    %% "play-json"    % "3.0.1",
      "com.github.pathikrit" %% "better-files" % "3.9.2"
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

val poiVersion       = "5.2.4"
val playSlickVersion = "6.0.0-M2"

commands += Command.single("evaluate") { (state, file) =>
  s"Test/run $file" :: state
}

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

  // Evaluation
  "com.github.pathikrit" %% "better-files" % "3.9.2" % Test,
  "com.github.scopt"     %% "scopt"        % "4.1.0" % Test
)
