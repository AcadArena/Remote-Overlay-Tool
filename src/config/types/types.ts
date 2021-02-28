export interface ReduxState {
  live: Live;
}

export interface WebsocketUser {
  id: string;
  room: string;
  username: string;
}
export interface Live {
  lowerThirds?: LowerThirds;
  tournament?: Tournament;
  casters?: Caster[];
  match?: Match;
  match_live?: boolean;
  matches_previous?: Match[];
  matches_today?: Match[];
  matches_next?: Match[];
  websocket_users: WebsocketUser[];
  room: string;
}

export interface Caster {
  ign: string;
  name: string;
  photo?: string;
}

export type Tournaments = Tournament[];

export type LowerThirdsMode =
  | "ticker"
  | "casters"
  | "long"
  | "playerStats"
  | "playerQuote";
export interface LowerThirds {
  headline: string;
  ticker: string;
  announcement_headline: string;
  announcement_content: string;
  live?: boolean;
  mode: LowerThirdsMode;
  player?: Player;
  player_quote?: string;
  player_stats?: {
    left?: {
      property?: string;
      value?: string;
    };
    middle?: {
      property?: string;
      value?: string;
    };
    right?: {
      property?: string;
      value?: string;
    };
  };
}

export interface Tournament {
  uid?: "";
  id: number;
  name: string;
  url: string;
  [key: string]: any;
  tournament_type: string;
  started_at: string;
  completed_at: string;
  created_at: string;
  updated_at: string;
  // state: State;
  state: string;
  ranked_by: string;
  group_stages_enabled: boolean;
  teams: boolean;
  subdomain: string | null;
  participants_count: number;
  participants: Participant[];
  matches: Match[];
  game_name: string;
}

export interface ParticipantElement {
  participant: Match;
}

export interface Participant {
  id: number;
  tournament_id: number;
  name: string;
  seed: number;
  active: boolean;
  created_at: string;
  updated_at: string;
  final_rank: number | null;
  on_waiting_list: boolean;
  display_name_with_invitation_email_address: string;
  display_name: string;
  group_player_ids: number[];
  university_name?: string;
  university_acronym?: string;
  org_name?: string;
  org_acronym?: string;
  logo?: string;
  [key: string]: any;
  players?: Player[];
}

export interface Player {
  name: string;
  ign: string;
  photo_main?: string;
  photo_sub?: string;
  photo_profile_shot?: string;
  role?: "";
  team?: Participant;
}

export interface MatchElement {
  match: Match;
}

export interface Match {
  id: number;
  tournament_id: number;
  state: string;
  player1_id: number;
  player2_id: number;
  player1_prereq_match_id: number | null;
  player2_prereq_match_id: number | null;
  player1_is_prereq_match_loser: boolean;
  player2_is_prereq_match_loser: boolean;
  winner_id: number;
  loser_id: number;
  started_at: string;
  created_at: string;
  updated_at: string;
  identifier: string;
  has_attachment: boolean;
  round: number;
  group_id: number | null;
  underway_at: null | string;
  optional: boolean | null;
  completed_at: string;
  suggested_play_order: number;
  prerequisite_match_ids_csv: string;
  scores_csv: string;
  [key: string]: any;
}
