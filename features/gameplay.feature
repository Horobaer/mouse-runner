@desktop @mobile
Feature: Gameplay Mechanics
  As a player
  I want intuitive controls and engaging gameplay
  So that I can enjoy playing the game

  Background:
    Given the game application is loaded
    And the game has started

  # ----- Player Movement - Desktop -----
  @desktop
  Scenario: Player jumps with spacebar on desktop
    Given I am on a desktop device with viewport "1280x720"
    And the player is on the ground
    When I press the spacebar
    Then the player should jump upward
    And the player's ears should flap twice

  @desktop
  Scenario: Player can perform multiple jumps on desktop
    Given I am on a desktop device with viewport "1280x720"
    And the player is in the air
    When I press the spacebar again
    Then the player should perform another jump

  @desktop
  Scenario: Player glides when holding spacebar on desktop
    Given I am on a desktop device with viewport "1280x720"
    And the player is falling
    When I hold the spacebar
    Then the player should glide slowly
    And a cheese paraglider should be displayed
    And the fall speed should be reduced to 3 units

  @desktop
  Scenario: Glide time is limited based on difficulty on desktop
    Given I am on a desktop device with viewport "1280x720"
    And the difficulty is "Hard"
    And the player is gliding
    When the glide timer exceeds 1000ms
    Then the player should stop gliding
    And the player should fall normally

  @desktop
  Scenario: Easy mode has extended glide time on desktop
    Given I am on a desktop device with viewport "1280x720"
    And the difficulty is "Easy"
    And the player is gliding
    Then the player should be able to glide for up to 3500ms

  @desktop
  Scenario: Player clicks mouse to jump on desktop
    Given I am on a desktop device with viewport "1280x720"
    When I click anywhere on the canvas
    Then the player should jump

  # ----- Player Movement - Mobile -----
  @mobile
  Scenario: Player jumps with touch on mobile
    Given I am on a mobile device with viewport "667x375" in landscape orientation
    And the player is on the ground
    When I tap the screen
    Then the player should jump upward
    And the player's ears should flap twice

  @mobile
  Scenario: Player can perform multiple jumps on mobile
    Given I am on a mobile device with viewport "667x375" in landscape orientation
    And the player is in the air
    When I tap the screen again
    Then the player should perform another jump

  @mobile
  Scenario: Touch and hold for glide on mobile
    Given I am on a mobile device with viewport "667x375" in landscape orientation
    And the player is falling
    When I touch and hold the screen
    Then the player should glide slowly
    And the cheese paraglider should be visible

  # ----- Ground Collision -----
  @desktop @mobile
  Scenario: Player lands on ground
    Given the player is falling
    When the player reaches the ground level
    Then the player should stop falling
    And the player should be grounded
    And the glide timer should reset

  # ----- Player Animation States -----
  @desktop @mobile
  Scenario: Player breathing animation when grounded
    Given the player is on the ground
    Then the player should display a breathing/bouncing animation
    And the player's ears should subtly move

  @desktop @mobile
  Scenario: Player stretch animation when jumping
    Given the player is jumping upward
    Then the player should appear stretched vertically
    And the player should appear narrower horizontally

  @desktop @mobile
  Scenario: Player barrel roll when hurt
    Given the player has been hurt by an enemy
    Then the player should perform a barrel roll animation
    And the player should be invulnerable for 2 seconds
    And the player should flash during invulnerability
