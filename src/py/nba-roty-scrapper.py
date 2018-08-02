import json
import math
import re
import requests

from bs4 import BeautifulSoup

# TODO:
# set a baseline threshold (mpg, something) that a player must be past to qualify
# add fifth advance metric
# calculate each player's z-score for each metric
# calculate total z-score aggregate for each metric set (standard vs advanced)
# order players by z-score aggregate (should this be done in backend)
# figure out step for skipping exporting text to html file then reimporting it with beautifulsoup
# test on actual link
# lambda function and aws hosting
# better commenting

# base data dictionary. We'll iterate over the data from basketball-reference (BR)
# and parse the data for players and stats and add it to this dictionary
rookie_data = {
    "metrics": ['winshare', 'per', 'usg', 'bpm', 'ppg', 'rpg', 'apg', 'spg', 'bpg'],
    "stats": [],
    "players": []
}

def getStandardDeviation(data, key):
    x = 0
    y = 0
    l = len(data)
    for obj in data:
        x = x + obj["metrics"][key]
        y = y + (obj["metrics"][key] ** 2)

    standardDeviation = math.sqrt((y - ((x ** 2) / l)) / (l - 1))
    print(standardDeviation)
    return standardDeviation

def getMean(data, key):
    x = 0;
    for obj in data:
        x = x + obj["metrics"][key]

    mean = x / len(data);
    print(mean);
    return mean;

def setStats(data):
    for metric in data["metrics"]:
        standard_dev = getStandardDeviation(data["players"], metric)
        mean = getMean(data["players"], metric)

        target_metric = {
            "metric": metric,
            "standard_dev": standard_dev,
            "mean": mean,
        }

        data["stats"].append(target_metric)

# ------------------------------------------------------------------------------
# GETTING THE NBA STANDINGS SO WE CAN GET TEAM GAMES AND WINS

# empty list to hold our team objects
standings = []

# getting the expanded standings broken down into rows
standings_request = requests.get("https://widgets.sports-reference.com/wg.fcgi?css=1&site=bbr&url=%2Fleagues%2FNBA_2018_standings.html&div=div_expanded_standings")
standings_content = BeautifulSoup(standings_request.text, "html.parser")
standings_table = standings_content.find("table", {"id": "expanded_standings"})
standings_rows = standings_table.find("tbody").findAll("tr")

# for each row ...
for row in standings_rows:

    # determine the team's record, wins and losses, wins games and team abbreviation
    record = row.find("td", {"data-stat": "Overall"}).text
    wins_losses = record.split("-")
    wins = int(wins_losses[0])
    games = int(wins_losses[0]) + int(wins_losses[1])
    link = row.find("td", {"data-stat": "team_name"}).find("a").get("href")
    split_link = link.split("teams/")
    team_short = split_link[1].split("/")[0]

    # create the team object
    team = {}
    team["team_name"] = row.find("td", {"data-stat": "team_name"}).text
    team["record"] = record
    team["wins"] = wins
    team["games"] = games
    team["short_name"] = team_short

    # append it to the standings list
    standings.append(team)


# The getting of the original data that writes the data into an html file. For production
# we'll probably want to skip the writing of the file and somehow convert the table text to html
# on the fly.

# r = requests.get('https://widgets.sports-reference.com/wg.fcgi?css=1&site=bbr&url=%2Fplay-index%2Fpsl_finder.cgi%3Frequest%3D1%26match%3Dsingle%26type%3Dtotals%26per_minute_base%3D36%26per_poss_base%3D100%26lg_id%3DNBA%26is_playoffs%3DN%26year_min%3D2018%26year_max%3D2018%26franch_id%3D%26season_start%3D1%26season_end%3D1%26age_min%3D0%26age_max%3D99%26shoot_hand%3D%26height_min%3D0%26height_max%3D99%26birth_country_is%3DY%26birth_country%3D%26birth_state%3D%26college_id%3D%26draft_year%3D%26is_active%3D%26debut_yr_nba_start%3D%26debut_yr_nba_end%3D%26is_hof%3D%26is_as%3D%26as_comp%3Dgt%26as_val%3D0%26award%3D%26pos_is_g%3DY%26pos_is_gf%3DY%26pos_is_f%3DY%26pos_is_fg%3DY%26pos_is_fc%3DY%26pos_is_c%3DY%26pos_is_cf%3DY%26qual%3D%26c1stat%3Dws%26c1comp%3Dgt%26c1val%3D-100%26c2stat%3Dbpm%26c2comp%3Dgt%26c2val%3D-100%26c3stat%3Dper%26c3comp%3Dgt%26c3val%3D-100%26c4stat%3Dusg_pct%26c4comp%3Dgt%26c4val%3D0%26c5stat%3D%26c5comp%3D%26c6mult%3D%26c6stat%3D%26order_by%3Dws%26order_by_asc%3D%26offset%3D0&div=div_stats')
#
# print(r.text)
#
# start = re.escape('<table')
# end = re.escape('</table>')
# st = r.text
# r.table = re.search('%s.*%s' % (start, end), st).group()
# print(r.table)
#
# file = open("../data/rookies.html", "w")
# file.write(r.table)
# file.close()



with open('../data/rookies.html', 'r') as rookies_table_file:

    # drill down to the table rows for players from the BR table
    content = BeautifulSoup(rookies_table_file, 'html.parser')
    rookies_table = content.find("tbody")
    rookies = rookies_table.findAll("tr")

    # iterate over those table rows, parsing out the data for each player
    for rookie in rookies:
        try:
            # pull the different metrics we'll need
            winshare = float(rookie.find("td", {"data-stat": "ws"}).text)
            per = float(rookie.find("td", {"data-stat": "per"}).text)
            usg = float(rookie.find("td", {"data-stat": "usg_pct"}).text)
            bpm = float(rookie.find("td", {"data-stat": "bpm"}).text)
            games = float(rookie.find("td", {"data-stat": "g"}).text)
            points = float(rookie.find("td", {"data-stat": "pts"}).text)
            rebounds = float(rookie.find("td", {"data-stat": "trb"}).text)
            assists = float(rookie.find("td", {"data-stat": "ast"}).text)
            steals = float(rookie.find("td", {"data-stat": "stl"}).text)
            blocks = float(rookie.find("td", {"data-stat": "blk"}).text)

            # create the player object with name, team, a placeholder for team wins
            # and dictionaries for that player's individual metrics and zscores (placeholder for now)
            player = {
                "player": rookie.find("td", {"data-stat": "player"}).text,
                "team": rookie.find("td", {"data-stat": "team_id"}).text,
                "wins": 0,
                "games": rookie.find("td", {"data-stat": "g"}).text,
                "metrics": {
                    "winshare": winshare,
                    "per": per,
                    "usg": usg,
                    "bpm": bpm,
                    "ppg": round(points/games, 1),
                    "rpg": round(rebounds/games, 1),
                    "apg": round(assists/games, 1),
                    "spg": round(steals/games, 1),
                    "bpg": round(blocks/games, 1)
                },
                "zscores": {
                    "winshare": 0,
                    "per": 0,
                    "usg": 0,
                    "bpm": 0,
                    "ppg": 0,
                    "rpg": 0,
                    "apg": 0,
                    "spg": 0,
                    "bpg": 0
                }
            }

            # append that player to the data's "players" list
            rookie_data["players"].append(player)

        # if we hit an attribute error for a row that doesn't contain a player, skip it
        except AttributeError:
            continue

    # calculate the standard deviation and mean for each metric for the set of players
    setStats(rookie_data)

    # dump that json into a file we can access from the interactive
    print(rookie_data)
    with open('../data/roty-metrics.json', 'w') as data_file:
        json.dump(rookie_data, data_file)




# test_data = {
#     "metrics": ['winshare', 'per'],
#     "stats": [],
#     "players": [
#       {
#         "player": 'Ben Simmons',
#         "metrics": {
#           "winshare": 9.2,
#           "per": 20,
#         },
#       },
#       { "player": 'Jasyon Taturm', "metrics": { "winshare": 7.1, "per": 15.3 } },
#       { "player": 'Josh Hart', "metrics": { "winshare": 3.4, "per": 12.2 } },
#       { "player": 'Lauri Markkanen', "metrics": { "winshare": 3.3, "per": 15.6 } },
#       { "player": 'Tyler Cavanaugh', "metrics": { "winshare": 1.2, "per": 13.0 } },
#       { "player": 'Justin Jackson', "metrics": { "winshare": 1.0, "per": 9.2 } },
#       { "player": 'Jamil Wilson', "metrics": { "winshare": 0.5, "per": 11.4 } },
#       { "player": 'Jalen Jones', "metrics": { "winshare": 0.1, "per": 10.3 } },
#       { "player": 'Josh Jackson', "metrics": { "winshare": -0.7, "per": 11.8 } },
#       { "player": 'Dennis Smith', "metrics": { "winshare": -0.7, "per": 12.8 } },
#     ]
# }
#
# for player in test_data['players']:
#     print(player['player']);





# Running the functions and writing the data. Thus far, this works. Need to expand to real data

# getStandardDeviation(test_data['players'], "winshare")
# getMean(test_data['players'], "winshare")

# setStats(test_data)

# with open('../data/roty-metrics.json', 'w') as data_file:
#     json.dump(test_data, data_file)
