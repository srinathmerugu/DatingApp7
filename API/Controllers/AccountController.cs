using System.Security.Cryptography;
using System.Text;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class AccountController : BaseApiController
    {
        private readonly DataContext _context;
        private readonly ITokenService _tokenService;
        public AccountController(DataContext context, ITokenService tokenService)
        {
            _context = context;
            _tokenService = tokenService;
        }

        [HttpPost("register")] //POST: /account/register

        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {
            if (await isUserExists(registerDto.Username)) return BadRequest("Username is taken dude!");

            using var hmac = new HMACSHA512();
            var user = new AppUser
            {
                UserName = registerDto.Username.ToLower(),
                PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDto.Password)),
                PasswordSalt = hmac.Key
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return new UserDto
            {
                Username = user.UserName,
                Token = _tokenService.createToken(user),
                // PhotoUrl = user.Photos.FirstOrDefault(photo => photo.IsMain)?.Url
            };
        }

        [HttpPost("login")] //POST: /account/login
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            var loggedInUser = await _context.Users.
            Include(p => p.Photos)
            .SingleOrDefaultAsync(user => user.UserName == loginDto.Username);

            if (loggedInUser == null) return Unauthorized("Invalid Username");

            using var hmac = new HMACSHA512(loggedInUser.PasswordSalt);

            var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDto.Password));

            for (int i = 0; i < computedHash.Length; i++)
            {
                if (computedHash[i] != loggedInUser.PasswordHash[i]) return Unauthorized("Invalid Password");
            }

            return new UserDto
            {
                Username = loggedInUser.UserName,
                Token = _tokenService.createToken(loggedInUser),
                PhotoUrl = loggedInUser.Photos.FirstOrDefault(photo => photo.IsMain)?.Url
            };
        }

        private async Task<bool> isUserExists(string username)
        {
            return await _context.Users.AnyAsync(user => user.UserName == username.ToLower());
        }
    }
}