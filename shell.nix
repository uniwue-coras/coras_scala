{ pkgs ? import <nixpkgs> { } }:

let
  java_pkg = pkgs.openjdk17_headless;
in
pkgs.mkShell {
  buildInputs = with pkgs; [
    java_pkg
    (sbt.override { jre = java_pkg; })
  ];
}
