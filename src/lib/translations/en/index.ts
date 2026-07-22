import { common } from "./common";
import { navigation } from "./navigation";
import { careers } from "./careers";
import { apply } from "./apply";
import { foundry } from "./foundry";
import { recruiter } from "./recruiter";
import { ai } from "./ai";
import { validation } from "./validation";

export const enMessages = {
  common,
  navigation,
  careers,
  apply,
  foundry,
  recruiter,
  ai,
  validation,
} as const;

export type Messages = typeof enMessages;
