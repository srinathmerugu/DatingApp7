using System.Security.Cryptography;
using System.Text;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class AccountController : BaseApiController
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly ITokenService _tokenService;
        private readonly IMapper _mapper;
        public AccountController(UserManager<AppUser> userManager, ITokenService tokenService, IMapper mapper)
        {
            _mapper = mapper;
            _userManager = userManager;
            _tokenService = tokenService;
        }

        [HttpPost("register")] //POST: /account/register?username=bob&password=pswd

        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {
            if (await isUserExists(registerDto.Username)) return BadRequest("Username is taken dude!");

            var user = _mapper.Map<AppUser>(registerDto);

            user.UserName = registerDto.Username.ToLower();

            var result = await _userManager.CreateAsync(user, registerDto.Password);

            if (!result.Succeeded) return BadRequest(result.Errors);

            var roleResult = await _userManager.AddToRoleAsync(user, "Member");

            if (!roleResult.Succeeded) return BadRequest(result.Errors);

            return new UserDto
            {
                Username = user.UserName,
                Token = await _tokenService.createToken(user),
                KnownAs = user.KnownAs,
                Gender = user.Gender
                // PhotoUrl = user.Photos.FirstOrDefault(photo => photo.IsMain)?.Url
            };
        }

        [HttpPost("login")] //POST: /account/login
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            var loggedInUser = await _userManager.Users.
            Include(p => p.Photos)
            .SingleOrDefaultAsync(user => user.UserName == loginDto.Username);

            if (loggedInUser == null) return Unauthorized("Invalid Username");

            var result = await _userManager.CheckPasswordAsync(loggedInUser, loginDto.Password);

            if (!result) return Unauthorized("Invalid Password");

            return new UserDto
            {
                Username = loggedInUser.UserName,
                Token = await _tokenService.createToken(loggedInUser),
                PhotoUrl = loggedInUser.Photos.FirstOrDefault(photo => photo.IsMain)?.Url,
                KnownAs = loggedInUser.KnownAs,
                Gender = loggedInUser.Gender
            };
        }

        private async Task<bool> isUserExists(string username)
        {
            return await _userManager.Users.AnyAsync(user => user.UserName == username.ToLower());
        }
    }
}