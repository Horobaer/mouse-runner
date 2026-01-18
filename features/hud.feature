@desktop @mobile
Feature: HUD (Heads-Up Display)
  As a player
  I want to see game information on screen during gameplay
  So that I can track my progress in real-time

  Background:
    Given the game application is loaded
    And the game has started

  # ----- HUD Visibility -----
  @desktop
  Scenario: HUD is visible during gameplay on desktop
    Given I am on a desktop device with viewport "1280x720"
    Then the HUD layer should be visible
    And the HUD should display the timer
    And the HUD should display the cheese count
    And the HUD should display the lives count
    And the HUD should display the current level
    And the HUD should display the player name with difficulty

  @mobile
  Scenario: HUD is visible during gameplay on mobile
    Given I am on a mobile device with viewport "667x375" in landscape orientation
    Then the HUD layer should be visible
    And all HUD elements should be compact
    And the HUD should be positioned near the top

  # ----- Timer Display -----
  @desktop @mobile
  Scenario: Timer updates during gameplay
    Given the game is in progress
    Then the timer should display elapsed time in seconds
    And the timer should show one decimal place (e.g., "12.5s")
    And the timer should have a timer icon

  # ----- Cheese Count -----
  @desktop @mobile
  Scenario: Cheese count updates when collecting cheese
    Given the player has collected 0 cheese
    When the player collects a cheese item
    Then the cheese count should display "🧀 1"

  # ----- Lives Display -----
  @desktop @mobile
  Scenario: Lives display shows current lives
    Given the player has 2 lives
    Then the lives display should show a heart icon with "2"

  @desktop @mobile
  Scenario: Lives display updates when taking damage
    Given the player has 2 lives
    When the player is hit by an enemy
    Then the lives display should show "1"

  @desktop @mobile
  Scenario: Lives display updates when collecting heart
    Given the player has 1 life
    When the player collects a heart
    Then the lives display should show "2"

  # ----- Level Display -----
  @desktop @mobile
  Scenario: Level display shows current level
    Given the current level is 1
    Then the level display should show a stairs icon with "1"

  @desktop @mobile
  Scenario: Level display updates on level up
    Given the current level is 1
    When the level increases to 2
    Then the level display should show "2"

  # ----- Player Info -----
  @desktop
  Scenario: Player name and difficulty displayed on desktop
    Given the player name is "SpeedyMouse"
    And the difficulty is "Hard"
    Then the player info should display "Player: SpeedyMouse (HARD)"

  @mobile
  Scenario: Player name visible on mobile
    Given the player name is "MobileMouse"
    Then the player info should display the player name

  # ----- HUD Styling -----
  @desktop
  Scenario: HUD uses consistent styling on desktop
    Given I am on a desktop device with viewport "1280x720"
    Then the HUD text should use Impact font
    And the HUD text should have a black text shadow
    And the HUD text should be white
    And the lives display should be red

  @mobile
  Scenario: HUD uses compact styling on mobile
    Given I am on a mobile device with viewport "667x375" in landscape orientation
    Then the HUD elements should use smaller font sizes
    And the HUD should have reduced padding
    And the HUD elements should not wrap

  # ----- HUD Positioning -----
  @desktop
  Scenario: HUD positioned at top center on desktop
    Given I am on a desktop device with viewport "1280x720"
    Then the HUD should be positioned at the top of the screen
    And the HUD should be centered horizontally
    And the HUD elements should be spread across the width

  @mobile
  Scenario: HUD positioned at top on mobile
    Given I am on a mobile device with viewport "667x375" in landscape orientation
    Then the HUD should be positioned at the top with minimal padding
    And the HUD elements should be aligned to the left with gaps

  # ----- HUD Hidden Before Start -----
  @desktop @mobile
  Scenario: HUD hidden before game starts
    Given the game has not started yet
    Then the HUD layer should be hidden
    And the start screen should be visible

  @desktop @mobile
  Scenario: HUD appears when game starts
    Given the start screen is visible
    When the player starts the game
    Then the HUD layer should become visible
    And the start screen should be hidden
