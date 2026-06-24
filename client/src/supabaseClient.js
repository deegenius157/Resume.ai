import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tkbibprszkrwgtmnexaz.supabase.co';
const supabaseAnonKey = 'sb_publishable_QhnNbsU439dTjRHdaIpjBw_LqYPMBHH';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);