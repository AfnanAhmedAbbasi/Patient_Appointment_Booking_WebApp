import { createClient } from "https://esm.sh/@supabase/supabase-js";

const supabaseUrl = 'https://wvidbaanrwcrtnpunnxu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind2aWRiYWFucndjcnRucHVubnh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE0MTcwNjYsImV4cCI6MjA3Njk5MzA2Nn0.dfTGxNSECI-cqFBe0dXkJQHZJ5xlBcITMybh7wMPMHk';

export const supabase = createClient(supabaseUrl, supabaseKey);


