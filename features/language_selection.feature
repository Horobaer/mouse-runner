@desktop @mobile
Feature: Language Selection
  As a player
  I want to select my preferred language
  So that I can play the game in a language I understand

  Background:
    Given the game application is loaded

  # ----- Desktop Context -----
  @desktop
  Scenario: Default language is English on desktop
    Given I am on a desktop device with viewport "1280x720"
    Then the "EN" language button should be active
    And the "DE" language button should be inactive
    And the game title should display "Mouse Adventure"
    And the start button should display "Start Game"

  @desktop
  Scenario: Switch to German language on desktop
    Given I am on a desktop device with viewport "1280x720"
    And the current language is English
    When I click the "DE" language button
    Then the "DE" language button should be active
    And the "EN" language button should be inactive
    And the difficulty labels should be translated to German
    And the placeholder text should be translated to German

  @desktop
  Scenario: Player name updates with language on desktop
    Given I am on a desktop device with viewport "1280x720"
    And I have not typed a custom name
    And the name field contains a random English mouse name
    When I switch language to German
    Then the name field should contain a new random German mouse name

  @desktop
  Scenario: Custom player name preserved on language switch
    Given I am on a desktop device with viewport "1280x720"
    And I have entered a custom name "MyMouse"
    When I switch language to German
    Then the name field should still contain "MyMouse"

  # ----- Mobile Context -----
  @mobile
  Scenario: Language buttons accessible on mobile
    Given I am on a mobile device with viewport "667x375" in landscape orientation
    Then the language buttons should be positioned in the top right corner
    And the language buttons should be large enough for touch interaction

  @mobile
  Scenario: Switch language on mobile
    Given I am on a mobile device with viewport "667x375" in landscape orientation
    When I tap the "DE" language button
    Then all UI text should update to German
    And the language selection should persist during gameplay
