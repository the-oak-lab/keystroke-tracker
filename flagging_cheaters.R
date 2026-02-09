# Install these packages if you haven't already done so:
# install.packages("tidyverse")
# install.packages("jsonlite")

library(tidyverse)
library(jsonlite)

# Put the file path to your Qualtrics data here:
data_file <- "[YOUR_FILE_PATH_HERE]"

# Put the name of your preferred ID column here (e.g., PROLIFIC_PID)
# The default, ResponseId, should work for your Qualtrics data but may not be
# your preferred identifier.
id_name <- "ResponseId"

# Data import
data <- read_csv(data_file, skip = 2) 
names(data) <- read_csv(data_file, n_max = 0) %>% names()

# ID import
qid_mappings <- read_csv(data_file)[2, ]

ids <- qid_mappings %>% 
  pivot_longer(everything(), names_to = "export_id") %>%
  mutate(qid = str_extract(value, "QID\\d+")) %>%
  filter(!is.na(qid), 
         !str_detect(value, "FIRST_CLICK|LAST_CLICK|PAGE_SUBMIT|CLICK_COUNT")) %>% 
  select(qid, export_id) %>%
  distinct(qid, .keep_all = TRUE)

# Flagging cheaters
keystroke_question_data <- data %>%
  select(all_of(id_name), keystroke_log) %>%
  filter(keystroke_log != "") %>%
  mutate(log_data = map(keystroke_log, ~fromJSON(.x)$data)) %>%
  unnest(log_data) %>%
  mutate(
    actual_char_count = nchar(text),
    pasted = pastes > 0,
    too_short = actual_char_count > (keypresses)
  ) %>% select(-keystroke_log) %>%
  left_join(ids, by = "qid") %>% 
  ungroup() %>%
  select(all_of(id_name), qid, export_id, everything())

# Participants to be manually reviewed
possible_cheaters <- keystroke_question_data %>%
  group_by(ResponseId) %>% 
  mutate(n_with_pastes = sum(pasted > 0),
         n_too_short = sum(too_short)) %>%
  filter(n_with_pastes > 0, n_too_short > 0) %>%
  select(ResponseId, qid, export_id, n_with_pastes, n_too_short, everything())





