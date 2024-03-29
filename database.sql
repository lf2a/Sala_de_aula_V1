-- MySQL Script generated by MySQL Workbench
-- seg 08 jul 2019 13:07:34 -03
-- Model: Sala_de_aula    Version: 2.5
-- MySQL Workbench Forward Engineering

-- A adição de comentários foi descontinuada porém o esquema da
-- tabela e seus relacionamentos ainda estão neste script 
-- (caso me de vontade de adicionar comentarios)

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema CZ7KZmc3yk
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema CZ7KZmc3yk
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `CZ7KZmc3yk` DEFAULT CHARACTER SET utf8 ;
USE `CZ7KZmc3yk` ;

-- -----------------------------------------------------
-- Table `CZ7KZmc3yk`.`GRUPO`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `CZ7KZmc3yk`.`GRUPO` (
  `ID_GRUPO` VARCHAR(20) CHARACTER SET 'utf8' NOT NULL,
  `NOME` VARCHAR(45) CHARACTER SET 'utf8' NOT NULL,
  PRIMARY KEY (`ID_GRUPO`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_unicode_ci;


-- -----------------------------------------------------
-- Table `CZ7KZmc3yk`.`POSTAGEM`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `CZ7KZmc3yk`.`POSTAGEM` (
  `ID_POSTAGEM` VARCHAR(20) CHARACTER SET 'utf8' NOT NULL,
  `TITULO` VARCHAR(45) CHARACTER SET 'utf8' NOT NULL,
  `DATA_POSTAGEM` DATETIME NOT NULL,
  `AUTOR` VARCHAR(45) CHARACTER SET 'utf8' NOT NULL,
  `CONTEUDO` LONGTEXT CHARACTER SET 'utf8' NOT NULL,
  `ID_GRUPO_FK` VARCHAR(20) CHARACTER SET 'utf8' NOT NULL,
  `AUTOR_ID` VARCHAR(20) CHARACTER SET 'utf8' NOT NULL,
  PRIMARY KEY (`ID_POSTAGEM`, `ID_GRUPO_FK`),
  INDEX `fk_POSTAGEM_GRUPO_idx` (`ID_GRUPO_FK` ASC),
  CONSTRAINT `fk_POSTAGEM_GRUPO`
    FOREIGN KEY (`ID_GRUPO_FK`)
    REFERENCES `CZ7KZmc3yk`.`GRUPO` (`ID_GRUPO`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_unicode_ci;


-- -----------------------------------------------------
-- Table `CZ7KZmc3yk`.`COMENTARIO`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `CZ7KZmc3yk`.`COMENTARIO` (
  `ID_COMENTARIO` VARCHAR(20) CHARACTER SET 'utf8' NOT NULL,
  `TITULO` VARCHAR(45) CHARACTER SET 'utf8' NOT NULL,
  `AUTOR` VARCHAR(20) CHARACTER SET 'utf8' NOT NULL,
  `CONTEUDO_POSTAGEM` VARCHAR(200) CHARACTER SET 'utf8' NOT NULL,
  `ID_POSTAGEM_FK` VARCHAR(20) CHARACTER SET 'utf8' NOT NULL,
  `DATA_COMENTARIO` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`ID_COMENTARIO`, `ID_POSTAGEM_FK`),
  INDEX `fk_COMENTARIO_POSTAGEM1_idx` (`ID_POSTAGEM_FK` ASC),
  CONSTRAINT `fk_COMENTARIO_POSTAGEM1`
    FOREIGN KEY (`ID_POSTAGEM_FK`)
    REFERENCES `CZ7KZmc3yk`.`POSTAGEM` (`ID_POSTAGEM`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_unicode_ci;


-- -----------------------------------------------------
-- Table `CZ7KZmc3yk`.`USUARIO`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `CZ7KZmc3yk`.`USUARIO` (
  `ID_USUARIO` VARCHAR(20) CHARACTER SET 'utf8' NOT NULL,
  `NOME` VARCHAR(45) CHARACTER SET 'utf8' NOT NULL,
  `EMAIL` VARCHAR(45) CHARACTER SET 'utf8' NOT NULL,
  `SENHA` VARCHAR(45) CHARACTER SET 'utf8' NOT NULL,
  `ISPROFESSOR` VARCHAR(5) CHARACTER SET 'utf8' NOT NULL,
  `ISADMIN` VARCHAR(5) CHARACTER SET 'utf8' NOT NULL,
  PRIMARY KEY (`ID_USUARIO`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_unicode_ci;


-- -----------------------------------------------------
-- Table `CZ7KZmc3yk`.`INTEGRANTE`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `CZ7KZmc3yk`.`INTEGRANTE` (
  `ID_USUARIO_FK` VARCHAR(20) CHARACTER SET 'utf8' NOT NULL,
  `ID_GRUPO_FK` VARCHAR(20) CHARACTER SET 'utf8' NOT NULL,
  PRIMARY KEY (`ID_USUARIO_FK`, `ID_GRUPO_FK`),
  INDEX `fk_USUARIO_has_GRUPO_GRUPO1_idx` (`ID_GRUPO_FK` ASC),
  INDEX `fk_USUARIO_has_GRUPO_USUARIO1_idx` (`ID_USUARIO_FK` ASC),
  CONSTRAINT `fk_USUARIO_has_GRUPO_GRUPO1`
    FOREIGN KEY (`ID_GRUPO_FK`)
    REFERENCES `CZ7KZmc3yk`.`GRUPO` (`ID_GRUPO`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_USUARIO_has_GRUPO_USUARIO1`
    FOREIGN KEY (`ID_USUARIO_FK`)
    REFERENCES `CZ7KZmc3yk`.`USUARIO` (`ID_USUARIO`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_unicode_ci;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
