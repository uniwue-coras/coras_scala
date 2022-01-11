name         := """coras"""
organization := "de.uniwue.is"

version := "1.0-SNAPSHOT"

lazy val root = (project in file(".")).enablePlugins(PlayScala)

scalaVersion := "2.13.8"

PlayKeys.playDefaultPort := 9016

val poiVersion = "5.1.0"

libraryDependencies ++= Seq(
  guice,

  // POI
  "org.apache.poi" % "poi"       % poiVersion,
  "org.apache.poi" % "poi-ooxml" % poiVersion,

  // Enums
  "com.beachape" %% "enumeratum-play"      % "1.7.0", // MIT
  "com.beachape" %% "enumeratum-play-json" % "1.7.0", // MIT

  // GraphQL
  "org.sangria-graphql" %% "sangria"           % "2.1.6", // Apache 2.0
  "org.sangria-graphql" %% "sangria-play-json" % "2.0.2", // Apache 2.0

  // Testing
  "org.scalatestplus.play" %% "scalatestplus-play" % "5.1.0" % Test
)

// Adds additional packages into Twirl
//TwirlKeys.templateImports += "de.uniwue.is.controllers._"

// Adds additional packages into conf/routes
// play.sbt.routes.RoutesKeys.routesImport += "de.uniwue.is.binders._"
