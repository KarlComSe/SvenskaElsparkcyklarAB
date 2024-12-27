export type ZoneQuery = {
    lat?: number;
    lon?: number;
    type?: ('parking' | 'charging' | 'speed')[];
    includes?: ('bikes')[];
    city?: ('Göteborg' | 'Jönköping' | 'Karlshamn')[];
    rad?: number;
};
