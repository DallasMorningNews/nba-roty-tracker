# How to update
1. Clone the scraper repo :https://github.com/DallasMorningNews/nba_roty_scraper
2. Run `pipenv install`, then run `pipenv shell`, then `python service.py`
3. Back in this repo, run `pipenv run jupyter notebook`
4. Navigate to the `all-rookies-10-years` file and run all the steps.
5. There are several points within the text that need to be checked to see if they are still factually accurate after updates:
- [Where Ayton ranks in PTS/G on the Suns](https://www.basketball-reference.com/teams/PHO/2019.html)
- [How many FG Doncic has made to take lead or tie game in last two minutes of 4th Q or OT](https://www.basketball-reference.com/play-index/shot_finder.cgi?request=1&match=single&year_id=2019&game_num_min=0&game_num_max=99&is_playoffs=N&q4=Y&q5=Y&time_remain_minutes=2&time_remain_seconds=0&time_remain_comp=le&is_tying=Y&is_go_ahead=Y&order_by=fg)
- [All rookies who averaged 20 PPG, 6 RPG, 5 APG](https://www.basketball-reference.com/play-index/psl_finder.cgi?request=1&match=single&type=totals&per_minute_base=36&per_poss_base=100&season_start=1&season_end=1&lg_id=NBA&age_min=0&age_max=99&is_playoffs=N&height_min=0&height_max=99&birth_country_is=Y&as_comp=gt&as_val=0&pos_is_g=Y&pos_is_gf=Y&pos_is_f=Y&pos_is_fg=Y&pos_is_fc=Y&pos_is_c=Y&pos_is_cf=Y&c1stat=pts_per_g&c1comp=gt&c1val=20&c2stat=trb_per_g&c2comp=gt&c2val=6&c3stat=ast_per_g&c3comp=gt&c3val=5&order_by=ws)
- [Where Doncic and Ayton rank in USG %](https://www.basketball-reference.com/play-index/psl_finder.cgi?request=1&match=single&type=totals&per_minute_base=36&per_poss_base=100&season_start=1&season_end=1&lg_id=NBA&age_min=0&age_max=99&is_playoffs=N&height_min=0&height_max=99&year_min=2019&year_max=2019&birth_country_is=Y&as_comp=gt&as_val=0&pos_is_g=Y&pos_is_gf=Y&pos_is_f=Y&pos_is_fg=Y&pos_is_fc=Y&pos_is_c=Y&pos_is_cf=Y&qual=pts_per_g_req&c1stat=g&c1comp=gt&c1val=10&order_by=usg_pct)
- [Rookies with > 27 USG %](https://www.basketball-reference.com/play-index/psl_finder.cgi?request=1&match=single&type=totals&per_minute_base=36&per_poss_base=100&season_start=1&season_end=1&lg_id=NBA&age_min=0&age_max=99&is_playoffs=N&height_min=0&height_max=99&year_min=2019&year_max=2019&birth_country_is=Y&as_comp=gt&as_val=0&pos_is_g=Y&pos_is_gf=Y&pos_is_f=Y&pos_is_fg=Y&pos_is_fc=Y&pos_is_c=Y&pos_is_cf=Y&qual=pts_per_g_req&c1stat=usg_pct&c1comp=gt&c1val=27&order_by=ws&order_by_asc=Y)
- [Last 10 years Rookie PPG leaderboard](https://www.basketball-reference.com/play-index/psl_finder.cgi?request=1&match=single&type=totals&per_minute_base=36&per_poss_base=100&season_start=1&season_end=1&lg_id=NBA&age_min=0&age_max=99&is_playoffs=N&height_min=0&height_max=99&year_min=2009&year_max=2019&birth_country_is=Y&as_comp=gt&as_val=0&pos_is_g=Y&pos_is_gf=Y&pos_is_f=Y&pos_is_fg=Y&pos_is_fc=Y&pos_is_c=Y&pos_is_cf=Y&qual=pts_per_g_req&order_by=pts_per_g)

# interactive_nba-rookie-of-the-year-tracker

This is an interactive presentation graphic built using the [`dmninteractives` Yeoman generator](https://github.com/DallasMorningNews/generator-dmninteractives).

## Requirements

- Node - `brew install node`
- Gulp - `npm install -g gulp-cli`

## Local development

#### Installation

1. `npm install` to install development tooling
2. `gulp` to open a local development server

#### What's inside

- `src/index.html` - HTML markup, which gets processed by Nunjucks
- `src/js/*.js` - Graphic scripts, written in ES2015 (it'll be transpiled with Babel)
- `src/scss/*.scss` - Graphic styles in SCSS
- `src/data/*` - files that should be both published and committed to the repository (probably CSVs, JSON, etc.); copied to `dist/data/*` by Gulp
- `src/assets/*` - assets (probably media assets, such as Illustrator files) that don’t get copied by Gulp but are tracked by `git`
- `dist/*` - All of the above, transpiled

_Important caveat:_ Video, audio and ZIP files are ignored by `git` regardless of where they're saved. You'll need to manually alter the [`.gitignore`](.gitignore) file to have them committed to Github.

#### Publishing

`gulp publish` will upload your [`dist/`](dist/) folder to the `2018/nba-rookie-of-the-year-tracker/` folder on our interactives S3 bucket.

## Copyright

&copy;2018 The Dallas Morning News
