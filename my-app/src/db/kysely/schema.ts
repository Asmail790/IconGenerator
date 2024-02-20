import { KyselyAuth, Database as TAdapter } from "@auth/kysely-adapter";
import { SqliteDialect, type Generated, Kysely, GeneratedAlways } from "kysely";
export interface KIDatabase {
  User: {
    id: Generated<string>;
    name: string | null;
    email: string;
    emailVerified: Date | null;
    image: string | null;
  };
  Account: {
    id: Generated<string>;
    userId: string;
    type: string;
    provider: string;
    providerAccountId: string;
    refresh_token: string | null;
    access_token: string | null;
    expires_at: number | null;
    token_type: string | null;
    scope: string | null;
    id_token: string | null;
    session_state: string | null;
  };
  Session: {
    id: Generated<string>;
    userId: string;
    sessionToken: string;
    expires: Date;
  };
  VerificationToken: {
    identifier: string;
    token: string;
    expires: Date;
  };
  Icon: {
    userId: string;
    data: ArrayBuffer;
    color: string;
    style: string;
    description: string;
    id: Generated<string>;
  };
  ImageToken: {
    userId: string;
    tokens: number;
  };
  OtherProperties: {
    property: string;
    value: string;
  };
}
