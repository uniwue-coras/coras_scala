package model.matching

import org.scalatest.flatspec.AnyFlatSpecLike
import org.scalatest.matchers.should.Matchers
import org.scalatest.prop.{TableDrivenPropertyChecks, TableFor3}

import scala.language.implicitConversions

trait CertainMatcherTest[T] extends AnyFlatSpecLike with Matchers with TableDrivenPropertyChecks:

  given Conversion[(T, T), CertainMatch[T]] = (t1, t2) => CertainMatch(t1, t2)

  protected val testData: TableFor3[Seq[T], Seq[T], CertainMatchingResult[T]]

  protected val matcherUnderTest: CertainMatcher[T]
