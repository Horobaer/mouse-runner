@desktop @mobile
Feature: Leaderboard
  As a player
  I want to see my scores on a leaderboard
  So that I can track my progress and compete with others

  Background:
    Given the game application is loaded

  # ----- Leaderboard Display - Desktop -----
  @desktop
  Scenario: Leaderboard appears after game over on desktop
    Given I am on a desktop device with viewport "1280x720"
    And I have finished a game
    When the game ends
    Then the leaderboard should be displayed
    And my score should be automatically submitted
    And my entry should be highlighted

  @desktop
  Scenario: Leaderboard shows celebration message on desktop
    Given I am on a desktop device with viewport "1280x720"
    And I have finished a game with level 3, time 25.5s, 10 cheese, 2 hearts
    When the leaderboard appears
    Then the celebration message should show my rank
    And the celebration message should show "Level 3"
    And the celebration message should show "25.5s"
    And the celebration message should show "🧀 10"
    And the celebration message should show "❤️ 2"

  @desktop
  Scenario: Leaderboard entry shows all stats on desktop
    Given I am on a desktop device with viewport "1280x720"
    And there are previous scores in the leaderboard
    Then each entry should display:
      | Field       | Example      |
      | Rank        | #1           |
      | Player Name | SpeedyMouse  |
      | Difficulty  | Icon         |
      | Level       | stairs icon  |
      | Time        | 30.5s        |
      | Cheese      | 🧀 15        |
      | Hearts      | ❤️ 3         |

  @desktop
  Scenario: Difficulty color coding on desktop
    Given I am on a desktop device with viewport "1280x720"
    And there are entries with different difficulties
    Then "Hard" entries should have a dark background
    And "Moderate" entries should have a light blue background
    And "Easy" entries should have a light green background

  # ----- Leaderboard Display - Mobile -----
  @mobile
  Scenario: Leaderboard appears after game over on mobile
    Given I am on a mobile device with viewport "667x375" in landscape orientation
    And I have finished a game
    When the game ends
    Then the leaderboard should be displayed
    And my score should be automatically submitted

  @mobile
  Scenario: Leaderboard is compact on mobile
    Given I am on a mobile device with viewport "667x375" in landscape orientation
    When the leaderboard is displayed
    Then the leaderboard should use compact styling
    And the leaderboard should fit within the viewport
    And the leaderboard should be scrollable if needed

  @mobile
  Scenario: Celebration message is compact on mobile
    Given I am on a mobile device with viewport "667x375" in landscape orientation
    When the leaderboard appears
    Then the celebration message font should be smaller
    And the celebration message should still show all stats

  # ----- Pagination -----
  @desktop @mobile
  Scenario: Leaderboard pagination with many entries
    Given there are more than 20 entries in the leaderboard
    When the leaderboard is displayed
    Then only 20 entries should be visible
    And pagination controls should appear
    And the current page should be highlighted

  @desktop
  Scenario: Navigate to next page on desktop
    Given the leaderboard is displayed with pagination
    When I click on page 2
    Then entries 21-40 should be displayed
    And page 2 should be highlighted

  @mobile
  Scenario: Navigate to next page on mobile
    Given the leaderboard is displayed with pagination
    When I tap on page 2
    Then entries 21-40 should be displayed

  @desktop @mobile
  Scenario: Highlighted entry page auto-navigation
    Given my current score ranks at position 25
    When the leaderboard appears
    Then the leaderboard should automatically show page 2
    And my entry should be visible and highlighted

  # ----- Scrollable List -----
  @desktop @mobile
  Scenario: Leaderboard list is scrollable
    Given there are entries in the leaderboard
    When the leaderboard is displayed
    Then the leaderboard list should be scrollable
    And a custom scrollbar should be visible

  @desktop @mobile
  Scenario: Highlighted entry scrolled into view
    Given my score is in the middle of the page
    When the leaderboard appears
    Then my highlighted entry should be scrolled into view
    And the scroll should be smooth

  # ----- Restart Button -----
  @desktop
  Scenario: Restart button visible after game over on desktop
    Given the game has ended
    When the leaderboard is displayed
    Then the "Restart Game" button should be visible
    And the button should show a refresh icon

  @mobile
  Scenario: Restart button visible after game over on mobile
    Given the game has ended
    When the leaderboard is displayed
    Then the "Restart Game" button should be visible
    And the button should be appropriately sized for touch

  # ----- Difficulty Selection on Restart -----
  @desktop @mobile
  Scenario: Difficulty options available on restart screen
    Given the game has ended
    When the leaderboard is displayed
    Then difficulty options should be visible: "Hard", "Moderate", "Easy"
    And the current difficulty should be pre-selected
