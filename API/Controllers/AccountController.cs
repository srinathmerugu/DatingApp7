using System.Security.Cryptography;
using System.Text;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class AccountController : BaseApiController
    {
        private readonly DataContext _context;
        private readonly ITokenService _tokenService;
        private readonly IMapper _mapper;
        public AccountController(DataContext context, ITokenService tokenService, IMapper mapper)
        {
            _mapper = mapper;
            _context = context;
            _tokenService = tokenService;
        }

        [HttpPost("register")] //POST: /account/register

        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {
            if (await isUserExists(registerDto.Username)) return BadRequest("Username is taken dude!");

            var user = _mapper.Map<AppUser>(registerDto);

            using var hmac = new HMACSHA512();

            user.UserName = registerDto.Username.ToLower();

            user.PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDto.Password));

            user.PasswordSalt = hmac.Key;

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return new UserDto
            {
                Username = user.UserName,
                Token = _tokenService.createToken(user),
                KnownAs = user.KnownAs
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
                PhotoUrl = loggedInUser.Photos.FirstOrDefault(photo => photo.IsMain)?.Url,
                KnownAs = loggedInUser.KnownAs
            };
        }

        private async Task<bool> isUserExists(string username)
        {
            return await _context.Users.AnyAsync(user => user.UserName == username.ToLower());
        }
    }
}