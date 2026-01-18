@desktop @mobile
Feature: Lives System and Game Over
  As a player
  I want a lives system
  So that I have multiple chances to play before the game ends

  Background:
    Given the game application is loaded
    And the game has started

  # ----- Lives Display -----
  @desktop
  Scenario: Lives displayed in HUD on desktop
    Given I am on a desktop device with viewport "1280x720"
    And the player has 2 lives
    Then the HUD should display a heart icon with "2"

  @mobile
  Scenario: Lives displayed in HUD on mobile
    Given I am on a mobile device with viewport "667x375" in landscape orientation
    And the player has 2 lives
    Then the HUD should display a heart icon with "2"
    And the lives display should be compact

  # ----- Lives Mechanics -----
  @desktop @mobile
  Scenario: Player starts with 2 lives
    Given the game has just started
    Then the player should have 2 lives

  @desktop @mobile
  Scenario: Losing a life
    Given the player has 2 lives
    When the player is hit by an enemy
    Then the player should have 1 life remaining
    And the lives display should update to "1"

  @desktop @mobile
  Scenario: Gaining a life from heart
    Given the player has 1 life
    When the player collects a heart
    Then the player should have 2 lives
    And the lives display should update to "2"

  @desktop @mobile
  Scenario: Lives do not go below zero in display
    Given the player has 1 life
    When the player is hit by an enemy
    Then the lives display should show "0"
    And the lives display should not show negative numbers

  # ----- Game Over -----
  @desktop @mobile
  Scenario: Game over when lives reach zero
    Given the player has 1 life
    When the player is hit by an enemy
    Then the game should end
    And the leaderboard screen should appear

  @desktop
  Scenario: Restart game after game over on desktop
    Given the game has ended
    And the leaderboard is displayed
    When I click the "Restart Game" button
    Then the game should restart
    And the player should have 2 lives
    And the level should be 1
    And the cheese count should be 0
    And the hearts collected should be 0

  @mobile
  Scenario: Restart game after game over on mobile
    Given the game has ended
    And the leaderboard is displayed
    When I tap the "Restart Game" button
    Then the game should restart
    And all stats should be reset

  @desktop
  Scenario: Restart game with spacebar on desktop
    Given the game has ended
    And the score has been submitted
    And the cooldown period has passed
    When I press the spacebar
    Then the game should restart

  @desktop @mobile
  Scenario: Change difficulty on restart
    Given the game has ended
    And the original difficulty was "Hard"
    When I select "Easy" difficulty on the restart screen
    And I restart the game
    Then the new game should use "Easy" difficulty
