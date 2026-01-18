@desktop @mobile
Feature: Start Screen
  As a player
  I want to see a welcoming start screen
  So that I can enter my name and configure game settings before playing

  Background:
    Given the game application is loaded
    And the game has not started yet

  # ----- Desktop Context -----
  @desktop
  Scenario: Start screen displays all elements on desktop
    Given I am on a desktop device with viewport "1280x720"
    Then I should see the game title "Mouse Adventure"
    And I should see a name input field with placeholder text
    And I should see a "Start Game" button
    And I should see difficulty options: "Hard", "Moderate", "Easy"
    And I should see language selection buttons: "EN", "DE"

  @desktop
  Scenario: Pre-filled player name from previous session on desktop
    Given I am on a desktop device with viewport "1280x720"
    And I have previously saved the player name "SpeedyMouse"
    When the start screen loads
    Then the name input field should contain "SpeedyMouse"

  @desktop
  Scenario: Random mouse name generated for new players on desktop
    Given I am on a desktop device with viewport "1280x720"
    And I have never played before
    When the start screen loads
    Then the name input field should contain a randomly generated mouse name

  @desktop
  Scenario: Start game with default settings on desktop
    Given I am on a desktop device with viewport "1280x720"
    And I enter the player name "DesktopMouse"
    And the "Hard" difficulty is selected by default
    When I click the "Start Game" button
    Then the start screen should be hidden
    And the HUD should be visible
    And the game should start with "Hard" difficulty

  @desktop
  Scenario: Start game with custom difficulty on desktop
    Given I am on a desktop device with viewport "1280x720"
    And I enter the player name "CasualGamer"
    When I select "Easy" difficulty
    And I click the "Start Game" button
    Then the game should start with "Easy" difficulty
    And the world speed should be 30% of hard mode speed
    And the glide time should be extended

  # ----- Mobile Context -----
  @mobile
  Scenario: Start screen displays all elements on mobile landscape
    Given I am on a mobile device with viewport "667x375" in landscape orientation
    Then I should see the game title "Mouse Adventure"
    And I should see a name input field with placeholder text
    And I should see a "Start Game" button
    And I should see difficulty options: "Hard", "Moderate", "Easy"
    And I should see language selection buttons: "EN", "DE"
    And all elements should be visible without scrolling

  @mobile
  Scenario: Start screen is compact on mobile
    Given I am on a mobile device with viewport "667x375" in landscape orientation
    Then the start screen should use compact padding
    And the title font size should be reduced for mobile
    And the input field should be sized appropriately for touch

  @mobile
  Scenario: Start game with touch interaction on mobile
    Given I am on a mobile device with viewport "667x375" in landscape orientation
    And I tap the name input field
    And I enter the player name "MobileMouse"
    When I tap the "Start Game" button
    Then the start screen should be hidden
    And the game should start
