@desktop @mobile
Feature: Responsive Design
  As a player on various devices
  I want the game to adapt to my screen size
  So that I can have an optimal gaming experience

  Background:
    Given the game application is loaded

  # ----- Canvas Scaling -----
  @desktop
  Scenario: Canvas fits desktop viewport
    Given I am on a desktop device with viewport "1920x1080"
    Then the game canvas should be visible
    And the canvas should maintain 16:9 aspect ratio
    And the canvas should fit within the viewport

  @desktop
  Scenario: Canvas scales on smaller desktop
    Given I am on a desktop device with viewport "1280x720"
    Then the game canvas should fit within the viewport
    And the canvas should maintain its aspect ratio

  @mobile
  Scenario: Canvas fits mobile landscape viewport
    Given I am on a mobile device with viewport "667x375" in landscape orientation
    Then the game canvas should fit within the viewport
    And the canvas should use maximum available width

  # ----- Start Screen Responsiveness -----
  @desktop
  Scenario: Start screen centered on desktop
    Given I am on a desktop device with viewport "1280x720"
    When the start screen is visible
    Then the start screen should be centered on screen
    And the start screen should have comfortable padding

  @mobile
  Scenario: Start screen fits mobile viewport
    Given I am on a mobile device with viewport "667x375" in landscape orientation
    When the start screen is visible
    Then the start screen should use compact padding
    And the start screen should fit within the viewport
    And no scrolling should be required to see all elements

  @mobile
  Scenario: Start screen title is readable on mobile
    Given I am on a mobile device with viewport "667x375" in landscape orientation
    Then the title font size should be reduced but readable
    And the title should not overflow its container

  # ----- Leaderboard Responsiveness -----
  @desktop
  Scenario: Leaderboard sized appropriately on desktop
    Given I am on a desktop device with viewport "1280x720"
    When the leaderboard is displayed
    Then the leaderboard should be 80% of viewport width
    And the leaderboard should have a maximum width of 1000px

  @mobile
  Scenario: Leaderboard fills mobile viewport
    Given I am on a mobile device with viewport "667x375" in landscape orientation
    When the leaderboard is displayed
    Then the leaderboard should use 95% of viewport width
    And the leaderboard should fit within 95% of viewport height
    And the leaderboard should use compact padding

  @mobile
  Scenario: Leaderboard is scrollable on mobile
    Given I am on a mobile device with viewport "667x375" in landscape orientation
    When the leaderboard has many entries
    Then the leaderboard list should be scrollable
    And the difficulty selection and restart button should remain visible

  # ----- HUD Responsiveness -----
  @desktop
  Scenario: HUD spans full width on desktop
    Given I am on a desktop device with viewport "1280x720"
    Then the HUD should match the canvas width
    And HUD elements should be evenly distributed

  @mobile
  Scenario: HUD is compact on mobile
    Given I am on a mobile device with viewport "667x375" in landscape orientation
    Then the HUD should use smaller font sizes
    And the HUD should have minimal padding
    And HUD elements should not wrap to new lines

  # ----- Touch Target Sizes -----
  @mobile
  Scenario: Buttons are touch-friendly on mobile
    Given I am on a mobile device with viewport "667x375" in landscape orientation
    Then all buttons should have adequate touch target sizes
    And the start button should be easily tappable
    And the difficulty options should be easily selectable

  @mobile
  Scenario: Input fields are touch-friendly on mobile
    Given I am on a mobile device with viewport "667x375" in landscape orientation
    Then the name input field should be easily tappable
    And the input field should be sized for touch keyboards

  # ----- Viewport Restrictions -----
  @mobile
  Scenario: No unwanted scrolling on mobile
    Given I am on a mobile device with viewport "667x375" in landscape orientation
    Then the body should have overflow hidden
    And no horizontal scrolling should occur
    And no vertical scrolling should occur

  @desktop @mobile
  Scenario: Minimum viewport width supported
    Given a device with viewport width at least 320px
    Then the game should render correctly
    And all UI elements should be visible
