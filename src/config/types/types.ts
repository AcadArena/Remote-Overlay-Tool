export interface ReduxState {
  live: Live;
}
export interface Live {
  lowerThirds?: LowerThirds;
  tournament?: Tournament;
  casters?: Caster[];
  match?: Match;
  matches_previous?: Match[];
  matches_today?: Match[];
  matches_next?: Match[];
}

export interface Caster {
  ign: string;
  name: string;
  photo?: string;
}

export type Tournaments = Tournament[];

export interface LowerThirds {
  headline: string;
  ticker: string;
  live?: boolean;
  live_casters?: boolean;
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
