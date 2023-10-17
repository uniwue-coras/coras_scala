{ pkgs ? import <nixpkgs> { } }:

pkgs.mkShell {
  buildInputs = with pkgs; [
    openjdk11_headless
    (sbt.override { jre = openjdk11_headless; })
  ];
}
