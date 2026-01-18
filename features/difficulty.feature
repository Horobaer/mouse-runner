@desktop @mobile
Feature: Difficulty Settings
  As a player
  I want to choose different difficulty levels
  So that I can enjoy the game at my preferred challenge level

  Background:
    Given the game application is loaded

  # ----- Difficulty Selection -----
  @desktop @mobile
  Scenario: Hard difficulty is selected by default
    Given the start screen is visible
    Then "Hard" difficulty should be selected by default

  @desktop
  Scenario: Select difficulty on start screen on desktop
    Given I am on a desktop device with viewport "1280x720"
    And the start screen is visible
    When I click on "Easy" difficulty
    Then "Easy" difficulty should be selected
    And the start button should remain enabled

  @mobile
  Scenario: Select difficulty on start screen on mobile
    Given I am on a mobile device with viewport "667x375" in landscape orientation
    And the start screen is visible
    When I tap on "Moderate" difficulty
    Then "Moderate" difficulty should be selected

  # ----- Hard Difficulty Settings -----
  @desktop @mobile
  Scenario: Hard difficulty base speed
    Given the difficulty is "Hard"
    When the game starts
    Then the world speed should be 6 (100% of base)

  @desktop @mobile
  Scenario: Hard difficulty glide time
    Given the difficulty is "Hard"
    When the game starts
    Then the maximum glide time should be 1000ms

  @desktop @mobile
  Scenario: Hard difficulty cat spawn rules
    Given the difficulty is "Hard"
    Then cats should spawn every level
    And cats can jump starting from level 3

  # ----- Moderate Difficulty Settings -----
  @desktop @mobile
  Scenario: Moderate difficulty base speed
    Given the difficulty is "Moderate"
    When the game starts
    Then the world speed should be approximately 3.9 (65% of base)

  @desktop @mobile
  Scenario: Moderate difficulty glide time
    Given the difficulty is "Moderate"
    When the game starts
    Then the maximum glide time should be 2500ms

  @desktop @mobile
  Scenario: Moderate difficulty cat spawn rules
    Given the difficulty is "Moderate"
    Then cats should spawn starting from level 3
    And cats should not be able to jump

  # ----- Easy Difficulty Settings -----
  @desktop @mobile
  Scenario: Easy difficulty base speed
    Given the difficulty is "Easy"
    When the game starts
    Then the world speed should be approximately 1.8 (30% of base)

  @desktop @mobile
  Scenario: Easy difficulty glide time
    Given the difficulty is "Easy"
    When the game starts
    Then the maximum glide time should be 3500ms

  @desktop @mobile
  Scenario: Easy difficulty cat spawn rules
    Given the difficulty is "Easy"
    Then cats should spawn only on even levels (2, 4, 6...)
    And cats should not be able to jump

  # ----- Difficulty Styling -----
  @desktop @mobile
  Scenario: Hard difficulty label styling
    Given the start screen is visible
    Then "Hard" difficulty option should have a dark background
    And "Hard" difficulty option should have white text

  @desktop @mobile
  Scenario: Moderate difficulty label styling
    Given the start screen is visible
    Then "Moderate" difficulty option should have a light blue background
    And "Moderate" difficulty option should have dark text

  @desktop @mobile
  Scenario: Easy difficulty label styling
    Given the start screen is visible
    Then "Easy" difficulty option should have a light green background
    And "Easy" difficulty option should have dark text

  @desktop @mobile
  Scenario: Selected difficulty is visually highlighted
    Given I have selected "Easy" difficulty
    Then the "Easy" label should be bold
    And the "Easy" label should be underlined

  # ----- Difficulty on Restart -----
  @desktop @mobile
  Scenario: Difficulty selection available on game over screen
    Given the game has ended
    When the leaderboard is displayed
    Then difficulty options should be visible
    And the current game's difficulty should be pre-selected

  @desktop @mobile
  Scenario: Change difficulty on restart
    Given the game has ended with "Hard" difficulty
    When I select "Easy" difficulty on restart screen
    And I restart the game
    Then the new game should use "Easy" difficulty settings
    And the world speed should reflect "Easy" settings
