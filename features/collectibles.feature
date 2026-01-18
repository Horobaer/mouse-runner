@desktop @mobile
Feature: Collectibles
  As a player
  I want to collect items during gameplay
  So that I can improve my score and gain extra lives

  Background:
    Given the game application is loaded
    And the game has started

  # ----- Cheese Collection -----
  @desktop @mobile
  Scenario: Cheese spawns during gameplay
    Given the game is in progress
    Then cheese items should spawn from the right side
    And cheese items should appear at various positions
    And cheese items should move left across the screen

  @desktop @mobile
  Scenario: Player collects cheese
    Given a cheese item is on the screen
    When the player collides with the cheese
    Then the cheese should disappear
    And the cheese count should increase by 1

  @desktop @mobile
  Scenario: Cheese count displayed in HUD
    Given the player has collected 5 cheese items
    Then the HUD should display "🧀 5"

  @desktop @mobile
  Scenario: Cheese spawn rate increases with level
    Given the current level is 1
    When the level increases to 2
    Then cheese items should spawn more frequently
    And the spawn rate should increase by approximately 50%

  # ----- Heart Collection -----
  @desktop @mobile
  Scenario: Heart spawns once per level
    Given the current level is 1
    Then at most one heart item should spawn during this level

  @desktop @mobile
  Scenario: Heart spawns after 20% of level duration
    Given the current level is in progress
    And 20% of the level duration has passed
    Then there is a 20% chance a heart will spawn

  @desktop @mobile
  Scenario: Heart guaranteed to spawn after 80% of level duration
    Given the current level is in progress
    And no heart has spawned yet
    And 80% of the level duration has passed
    Then a heart should definitely spawn

  @desktop @mobile
  Scenario: Player collects heart
    Given a heart item is flying across the screen
    When the player collides with the heart
    Then the heart should disappear
    And the player should gain 1 extra life
    And the collected hearts count should increase by 1
    And a mini firework explosion should play

  @desktop @mobile
  Scenario: Heart counter tracked for leaderboard
    Given the player has collected 3 hearts during the game
    When the game ends
    Then the leaderboard entry should show "❤️ 3"
