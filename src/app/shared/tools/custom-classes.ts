//FOR FORMS
export abstract class ShiftProperties {
  static readonly positions = [
    "general manager",
    "assistant manager",
    "lead",
    "barista",
  ];
  static readonly slots = ["morning", "day", "swing", "graveyard"];
  static readonly locations = [
    "rotunda",
    "food court",
    "tower 1",
    "tower 2",
    "pool",
    "breaker",
  ];
  static readonly days = [0, 1, 2, 3, 4, 5, 6];
  static readonly shiftHours = Array.apply(null, { length: 24 }).map(
    Number.call,
    Number
  );
}
