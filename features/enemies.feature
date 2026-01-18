@desktop @mobile
Feature: Enemies
  As a player
  I want various enemies to challenge me
  So that the game remains exciting and difficult

  Background:
    Given the game application is loaded
    And the game has started

  # ----- Ground Enemies -----
  @desktop @mobile
  Scenario: Ground enemies spawn during gameplay
    Given the game is in progress
    Then ground enemies should spawn from the right side
    And ground enemies should move left across the screen
    And ground enemies should be removed when off-screen

  @desktop @mobile
  Scenario: Player loses life when hitting ground enemy
    Given a ground enemy is approaching
    And the player is not invulnerable
    When the player collides with the ground enemy
    Then the player should lose 1 life
    And the player should become invulnerable
    And the player should perform a hurt animation

  # ----- Bird Enemies -----
  @desktop @mobile
  Scenario: Bird enemies spawn during gameplay
    Given the game is in progress
    Then bird enemies should spawn from the right side
    And bird enemies should fly at various heights
    And bird enemies should move left across the screen

  @desktop @mobile
  Scenario: Player loses life when hitting bird
    Given a bird enemy is flying toward the player
    And the player is not invulnerable
    When the player collides with the bird
    Then the player should lose 1 life
    And the player should become invulnerable

  # ----- Cat Enemies -----
  @desktop @mobile
  Scenario: Cat spawns once per level on Hard difficulty
    Given the difficulty is "Hard"
    And the current level is 1
    Then a cat enemy should spawn during this level

  @desktop @mobile
  Scenario: Cat can jump on Hard difficulty level 3+
    Given the difficulty is "Hard"
    And the current level is 3 or higher
    When a cat enemy spawns
    Then the cat should be able to jump

  @desktop @mobile
  Scenario: Cat spawns starting level 3 on Moderate difficulty
    Given the difficulty is "Moderate"
    And the current level is 2
    Then no cat enemy should spawn during this level

  @desktop @mobile
  Scenario: Cat spawns on level 3 on Moderate difficulty
    Given the difficulty is "Moderate"
    And the current level is 3
    Then a cat enemy should spawn during this level

  @desktop @mobile
  Scenario: Cat spawns on even levels on Easy difficulty
    Given the difficulty is "Easy"
    And the current level is 2
    Then a cat enemy should spawn during this level

  @desktop @mobile
  Scenario: Cat does not spawn on odd levels on Easy difficulty
    Given the difficulty is "Easy"
    And the current level is 3
    Then no cat enemy should spawn during this level

  @desktop @mobile
  Scenario: Player loses life when hitting cat
    Given a cat enemy is approaching
    And the player is not invulnerable
    When the player collides with the cat
    Then the player should lose 1 life

  # ----- Enemy Spawn Rate -----
  @desktop @mobile
  Scenario: Enemy spawn rate increases with level
    Given the current level is 1
    And the base enemy spawn interval is 2000ms
    When the level increases to 2
    Then the enemy spawn interval should decrease by 200ms

  @desktop @mobile
  Scenario: Enemy spawn interval has a minimum limit
    Given the current level is very high
    Then the enemy spawn interval should not go below 500ms

  # ----- Invulnerability -----
  @desktop @mobile
  Scenario: Player is invulnerable after being hurt
    Given the player was just hurt
    When another enemy collides with the player
    Then the player should not lose a life
    And the invulnerability should last 2 seconds

  @desktop @mobile
  Scenario: Invulnerability expires after 2 seconds
    Given the player was hurt 2 seconds ago
    Then the player should no longer be invulnerable
    And the player should no longer flash
