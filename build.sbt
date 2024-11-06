name         := "coras"
scalaVersion := "2.13.14"
organization := "de.uniwue.ls6"
version      := "0.2.1"

semanticdbEnabled := true
semanticdbVersion := scalafixSemanticdb.revision
scalacOptions ++= Seq(
  "-feature",
  "-Wunused:imports",
  "-Wunused:locals",
  "-Wunused:privates",
  "-Wunused:params",
//  "-Wunused:unsafe-warn-patvars",
  "-Wunused:linted",
  "-Wunused:implicits"
)

// buid to coras.tar.gz (without version suffix)
Universal / packageName := s"${name.value}"

lazy val root = (project in file("."))
  .enablePlugins(PlayScala, ScalaTsiPlugin)
  .settings(
    // show short stack trace in test errors
    // Test / testOptions += Tests.Argument("-oS"),
    // Scala tsi
    typescriptExports         := Seq("model.docxReading.DocxText"),
    typescriptOutputFile      := baseDirectory.value / "vite_ui" / "src" / "myTsModels.ts",
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

val poiVersion       = "5.2.5"
val playSlickVersion = "5.3.1"

libraryDependencies ++= Seq(
  ws,
  guice,

  // Logging warnings...
  "org.apache.logging.log4j" % "log4j-core"   % "2.23.1", // Apache 2.0
  "org.slf4j"                % "slf4j-simple" % "2.0.13" % Provided, // MIT

  // POI
  "org.apache.poi" % "poi"       % poiVersion, // Apache 2.0
  "org.apache.poi" % "poi-ooxml" % poiVersion, // Apache 2.0

  // BCrypt
  "com.github.t3hnar" %% "scala-bcrypt" % "4.3.0", // Apache 2.0

  // JWT
  // => 10.0.1 for play 3.0
  "com.github.jwt-scala" %% "jwt-play-json" % "9.4.4", // Apache 2.0

  // GraphQL
  "org.sangria-graphql" %% "sangria" % "4.1.0", // Apache 2.0
  // -> 2.1.0 for play 2.9 / 3.0, not released?
  "org.sangria-graphql" %% "sangria-play-json" % "2.0.2", // Apache 2.0

  // Database
  "org.mariadb.jdbc" % "mariadb-java-client" % "3.3.3", // LGPL 2.1

  "com.typesafe.play" %% "play-slick"            % playSlickVersion, // Apache 2.0
  "com.typesafe.play" %% "play-slick-evolutions" % playSlickVersion, // Apache 2.0

  // Enums
  // 1.8.x for play 3.0 (or maybe native enums)
  "com.beachape" %% "enumeratum-play" % "1.7.1", // MIT

  // Evaluation
  "com.github.pathikrit" %% "better-files" % "3.9.2" % Test,
  "com.github.scopt"     %% "scopt"        % "4.1.0" % Test,

  // Testing
  "org.scalameta" %% "munit" % "1.0.0-RC1" % Test,

  // Progress Bar
  "me.tongfei" % "progressbar" % "0.10.1" % Test // MIT
)
