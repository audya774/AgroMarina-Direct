import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kdplifmygsvsatcpteue.supabase.co';
const supabaseKey = 'sb_publishable_v-uugJ-tvPOszha3smWcDg_9uXLhMNP';

export const supabase = createClient(supabaseUrl, supabaseKey);
