module Jekyll
  module GitHubLink
    def github_link(input)
      "https://github.com/bakkyalo/mypage/blob/master/#{input}"
    end
  end
end

Liquid::Template.register_filter(Jekyll::GitHubLink)
