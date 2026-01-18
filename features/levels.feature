@desktop @mobile
Feature: Level Progression
  As a player
  I want to progress through levels
  So that the game becomes more challenging over time

  Background:
    Given the game application is loaded
    And the game has started

  # ----- Level Display -----
  @desktop
  Scenario: Current level displayed in HUD on desktop
    Given I am on a desktop device with viewport "1280x720"
    And the current level is 1
    Then the HUD should display a stairs icon with "1"

  @mobile
  Scenario: Current level displayed in HUD on mobile
    Given I am on a mobile device with viewport "667x375" in landscape orientation
    And the current level is 1
    Then the HUD should display a stairs icon with "1"

  # ----- Level Progression -----
  @desktop @mobile
  Scenario: Level advances after 10 seconds
    Given the current level is 1
    And the level timer is at 0
    When 10 seconds of gameplay have passed
    Then the level should increase to 2
    And the level timer should reset

  @desktop @mobile
  Scenario: Level up triggers firework effects
    When a level up occurs
    Then firework explosions should appear on screen
    And a center burst should appear at the screen center
    And smaller bursts should appear at the sides

  @desktop @mobile
  Scenario: Level up announcement displayed
    When a level up occurs
    Then "LEVEL UP!" text should appear on screen
    And "Speed Increased" subtitle should appear
    And the announcement should be visible for 3 seconds

  @desktop @mobile
  Scenario: World speed increases on level up
    Given the current level is 1
    And the world speed is 6
    When the level increases to 2
    Then the world speed should increase by 1

  @desktop @mobile
  Scenario: Player color changes on level up
    Given the current level is 1
    And the player color is gray
    When the level increases to 2
    Then the player color should change to red

  @desktop @mobile
  Scenario: Player color cycles through colors
    Given the current level is 6
    When the level increases to 7
    Then the player color should cycle back to the first color

  # ----- Difficulty Impact -----
  @desktop @mobile
  Scenario: Hard difficulty starts with base speed
    Given the difficulty is "Hard"
    When the game starts
    Then the world speed should be 6

  @desktop @mobile
  Scenario: Moderate difficulty starts with reduced speed
    Given the difficulty is "Moderate"
    When the game starts
    Then the world speed should be approximately 3.9

  @desktop @mobile
  Scenario: Easy difficulty starts with slow speed
    Given the difficulty is "Easy"
    When the game starts
    Then the world speed should be approximately 1.8

  # ----- Heart and Cat Spawn Reset -----
  @desktop @mobile
  Scenario: Heart spawn flag resets on level up
    Given the current level has already spawned a heart
    When the level increases
    Then a new heart can spawn in the new level

  @desktop @mobile
  Scenario: Cat spawn flag resets on level up
    Given the current level has already spawned a cat
    When the level increases
    Then a new cat can spawn in the new level
