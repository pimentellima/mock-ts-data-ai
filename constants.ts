export const initialCredits = 2.5
export const itemsPerCredit = 15
export const ITEMS_PER_PAGE = 6
export const TOKEN_TTL = 2 * 24 * 60 * 60 * 1000

export const defaultResultJson =
    '[{"id":1,"name":"Alice","country":"Brazil","city":"SaoPaulo","hobbies":["Reading","Cooking"]},{"id":2,"name":"Bob","country":"Brazil","city":"RiodeJaneiro","hobbies":["Hiking","Photography"]},{"id":3,"name":"Charlie","country":"Brazil","city":"SaoPaulo","hobbies":["Painting","Gardening"]},{"id":4,"name":"David","country":"Brazil","city":"Brasilia","hobbies":["Dancing","Swimming"]},{"id":5,"name":"Eve","country":"Brazil","city":"Salvador","hobbies":["Traveling","Yoga"]},{"id":6,"name":"Frank","country":"Brazil","city":"RiodeJaneiro","hobbies":["Cooking","Playingguitar"]},{"id":7,"name":"Grace","country":"Brazil","city":"SaoPaulo","hobbies":["Reading","Painting"]},{"id":8,"name":"Henry","country":"Brazil","city":"Brasilia","hobbies":["Hiking","Photography"]},{"id":9,"name":"Ivy","country":"Brazil","city":"Salvador","hobbies":["Gardening","Swimming"]},{"id":10,"name":"Jack","country":"Brazil","city":"RiodeJaneiro","hobbies":["Dancing","Yoga"]},{"id":11,"name":"Kate","country":"Brazil","city":"SaoPaulo","hobbies":["Traveling","Playingguitar"]},{"id":12,"name":"Liam","country":"Brazil","city":"Brasilia","hobbies":["Cooking","Painting"]},{"id":13,"name":"Mia","country":"Brazil","city":"Salvador","hobbies":["Reading","Photography"]},{"id":14,"name":"Noah","country":"Brazil","city":"RiodeJaneiro","hobbies":["Hiking","Swimming"]},{"id":15,"name":"Olivia","country":"Brazil","city":"SaoPaulo","hobbies":["Gardening","Yoga"]},{"id":16,"name":"Peter","country":"Brazil","city":"Brasilia","hobbies":["Dancing","Playingguitar"]},{"id":17,"name":"Quinn","country":"Brazil","city":"Salvador","hobbies":["Traveling","Painting"]},{"id":18,"name":"Ryan","country":"Brazil","city":"RiodeJaneiro","hobbies":["Cooking","Photography"]},{"id":19,"name":"Sophia","country":"Brazil","city":"SaoPaulo","hobbies":["Hiking","Swimming"]},{"id":20,"name":"Thomas","country":"Brazil","city":"Brasilia","hobbies":["Gardening","Yoga"]},{"id":21,"name":"Uma","country":"Brazil","city":"Salvador","hobbies":["Dancing","Playingguitar"]},{"id":22,"name":"Vincent","country":"Brazil","city":"RiodeJaneiro","hobbies":["Traveling","Painting"]},{"id":23,"name":"Wendy","country":"Brazil","city":"SaoPaulo","hobbies":["Cooking","Photography"]},{"id":24,"name":"Xavier","country":"Brazil","city":"Brasilia","hobbies":["Reading","Swimming"]},{"id":25,"name":"Yara","country":"Brazil","city":"Salvador","hobbies":["Hiking","Yoga"]}]'

export const REFRESH_TOKEN_TTL = 30 * 24 * 60 * 60 * 1000 // 30 dias
export const ACCESS_TOKEN_TTL = 1000 * 60 * 10 // 10 minutos

export const creditPriceMap =
    process.env.NODE_ENV === "production"
        ? ({
              150: "price_1PQFyfEyugco4uX2lrAx2FZJ",
              300: "price_1PQFycEyugco4uX24ETerPNl",
              900: "price_1PQFyaEyugco4uX2A2hNP6Uu",
          } as const)
        : ({
              150: "price_1PPyasEyugco4uX2EuK9WWkZ",
              300: "price_1PPyb5Eyugco4uX2I3SlzwBs",
              900: "price_1PPycnEyugco4uX2iZBEeaLC",
          } as const)
