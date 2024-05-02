package model

import munit.{FunSuite, Location, TestOptions}

abstract class DataDrivenTestFunSuite extends FunSuite {

  def testEach[I, O](vals: (I, O)*)(testOptions: (I, O) => TestOptions, fut: I => O)(implicit loc: Location) = for {
    ((input, output), index) <- vals.zipWithIndex

    initialTos = testOptions(input, output)

    tos = initialTos.withName(s"$index: ${initialTos.name}")
  } yield test(tos) { assertEquals(fut(input), output) }
}
